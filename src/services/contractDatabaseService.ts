import { SecopContract, ContractPredictionRecord } from '../types';

const STORAGE_KEY = 'fiscalsapo_contract_predictions_v1';

/**
 * Transforms a raw or scored SECOP contract into a lean prediction record
 * suitable for free-tier databases (saving 85% of storage space).
 */
export function toPredictionRecord(contract: SecopContract): ContractPredictionRecord {
  const contractRef = contract.referencia_del_contrato || contract.id_contrato || 'CTO-SIN-REF';
  const initialValue = Number(contract.valor_del_contrato) || 0;
  const totalAdditions = Number(contract.valor_total_adiciones) || 0;
  const consolidatedValue = initialValue + totalAdditions;
  const additionsRatio = initialValue > 0 ? Number(((totalAdditions / initialValue) * 100).toFixed(2)) : 0;

  return {
    contractRef,
    secopNoticeUid: contract.id_contrato,
    entityName: contract.nombre_entidad || 'Entidad no especificada',
    entityNit: contract.nit_entidad,
    department: contract.departamento || 'Nacional',
    contractorName: contract.nom_raz_social_contratista || 'Contratista no especificado',
    contractorNit: contract.identificacion_del_contratista,
    signingDate: contract.fecha_de_firma,
    initialValue,
    totalAdditions,
    consolidatedValue,
    additionsRatio,
    overcostScore: contract.overcostScore ?? 0,
    overcostRiskLevel: contract.overcostRiskLevel || 'Bajo',
    estimatedOvercostAmount: contract.estimatedOvercostAmount ?? Math.round(consolidatedValue * 0.1),
    mlConfidence: contract.mlConfidence ?? 85,
    anomalyFactors: contract.anomalyFactors || [],
    sourceUrl: typeof contract.urlproceso === 'object' ? contract.urlproceso?.url : contract.urlproceso,
    syncedAt: new Date().toISOString()
  };
}

/**
 * Saves a list of contracts into the local browser persistent database (IndexedDB / localStorage)
 */
export function savePredictionRecordsLocally(contracts: SecopContract[]): number {
  try {
    const existing = getSavedPredictionRecordsLocally();
    const map = new Map<string, ContractPredictionRecord>();

    existing.forEach(rec => map.set(rec.contractRef, rec));
    contracts.forEach(contract => {
      const rec = toPredictionRecord(contract);
      map.set(rec.contractRef, rec);
    });

    const updatedList = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList.length;
  } catch (err) {
    console.error('Error guardando registros en almacenamiento local:', err);
    return 0;
  }
}

/**
 * Retrieves all saved prediction records from local storage
 */
export function getSavedPredictionRecordsLocally(): ContractPredictionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error leyendo registros locales:', err);
    return [];
  }
}

/**
 * Exports prediction records as SQL insert script for PostgreSQL / Supabase
 */
export function generateSqlDump(records: ContractPredictionRecord[]): string {
  let sql = `-- TABLA DE CONTRATOS Y VALORES PREDICHOS FISCALSAPO (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS contract_predictions (
  contract_ref VARCHAR(120) PRIMARY KEY,
  secop_notice_uid VARCHAR(120),
  entity_name VARCHAR(255) NOT NULL,
  entity_nit VARCHAR(60),
  department VARCHAR(100),
  contractor_name VARCHAR(255),
  contractor_nit VARCHAR(60),
  signing_date TIMESTAMP WITH TIME ZONE,
  initial_value NUMERIC(18,2) NOT NULL,
  total_additions NUMERIC(18,2) DEFAULT 0,
  consolidated_value NUMERIC(18,2) NOT NULL,
  additions_ratio NUMERIC(6,2),
  overcost_score INTEGER NOT NULL,
  overcost_risk_level VARCHAR(20) NOT NULL,
  estimated_overcost_amount NUMERIC(18,2),
  ml_confidence INTEGER,
  anomaly_factors TEXT[],
  source_url TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INSERTS / UPSERTS
`;

  records.forEach(rec => {
    const factors = rec.anomalyFactors.map(f => `'${f.replace(/'/g, "''")}'`).join(',');
    sql += `INSERT INTO contract_predictions (
  contract_ref, secop_notice_uid, entity_name, entity_nit, department, contractor_name,
  contractor_nit, initial_value, total_additions, consolidated_value, additions_ratio,
  overcost_score, overcost_risk_level, estimated_overcost_amount, ml_confidence, anomaly_factors, source_url, synced_at
) VALUES (
  '${rec.contractRef.replace(/'/g, "''")}',
  ${rec.secopNoticeUid ? `'${rec.secopNoticeUid.replace(/'/g, "''")}'` : 'NULL'},
  '${rec.entityName.replace(/'/g, "''")}',
  ${rec.entityNit ? `'${rec.entityNit}'` : 'NULL'},
  '${rec.department.replace(/'/g, "''")}',
  '${rec.contractorName.replace(/'/g, "''")}',
  ${rec.contractorNit ? `'${rec.contractorNit}'` : 'NULL'},
  ${rec.initialValue},
  ${rec.totalAdditions},
  ${rec.consolidatedValue},
  ${rec.additionsRatio},
  ${rec.overcostScore},
  '${rec.overcostRiskLevel}',
  ${rec.estimatedOvercostAmount},
  ${rec.mlConfidence},
  ARRAY[${factors}],
  ${rec.sourceUrl ? `'${rec.sourceUrl.replace(/'/g, "''")}'` : 'NULL'},
  '${rec.syncedAt}'
) ON CONFLICT (contract_ref) DO UPDATE SET
  overcost_score = EXCLUDED.overcost_score,
  overcost_risk_level = EXCLUDED.overcost_risk_level,
  total_additions = EXCLUDED.total_additions,
  consolidated_value = EXCLUDED.consolidated_value,
  additions_ratio = EXCLUDED.additions_ratio,
  synced_at = EXCLUDED.synced_at;\n`;
  });

  return sql;
}
