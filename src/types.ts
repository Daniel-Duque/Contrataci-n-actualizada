export interface SecopContract {
  id_contrato?: string;
  referencia_del_contrato: string;
  proceso_de_compra?: string;
  nombre_entidad: string;
  nit_entidad?: string;
  departamento: string;
  ciudad: string;
  ordenentidad?: string;
  objeto_del_contrato: string;
  tipo_de_contrato: string;
  modalidad_de_contratacion: string;
  valor_del_contrato: number | string;
  valor_total_adiciones?: number | string;
  fecha_de_firma?: string;
  fecha_de_inicio?: string;
  fecha_de_fin?: string;
  plazo_de_ejec_del_contrato?: string;
  nom_raz_social_contratista: string;
  identificacion_del_contratista?: string;
  tipodocproveedor?: string;
  urlproceso?: { url: string } | string;
  estado_del_proceso?: string;
  estado_contrato?: string;
  liquidaci_n?: string;
  obligaci_n_ambiental?: string;
  
  // Computed / ML Model fields
  overcostScore?: number; // 0 to 100
  overcostRiskLevel?: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  anomalyFactors?: string[];
  estimatedOvercostAmount?: number;
  mlConfidence?: number;
  predictionDetails?: {
    ratioVsCategory?: number;
    additionRatio?: number;
    singleBidderRisk?: boolean;
    durationDeviation?: number;
    semanticRiskFlags?: string[];
    explanation?: string;
  };
}

export interface ContractDocument {
  id: string;
  contractRef: string;
  title: string;
  category: 'Estudios Previos' | 'Pliego de Condiciones' | 'Contrato Principal' | 'Propuesta Económica' | 'Adición / Modificatorio' | 'Informe de Supervisión' | 'Póliza y Garantía' | 'Acta de Liquidación';
  filename: string;
  fileSize: string;
  pages: number;
  downloadUrl: string;
  hashSha256: string;
  dateUploaded: string;
  extractedTextSample: string;
  isStoredInDataLake: boolean;
  dataLakeUri?: string;
}

export interface RagMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    docTitle: string;
    page: number;
    snippet: string;
    relevanceScore: number;
  }[];
  timestamp: string;
}

export interface MLOpsConfig {
  modelVersion: string;
  modelType: string;
  trainingDatasetDate: string;
  f1Score: number;
  aucRoc: number;
  precision: number;
  recall: number;
  driftStatus: 'Normal' | 'Concept Drift Detectado' | 'Data Drift Ligero';
  lastRetrainedAt: string;
  featureImportance: { feature: string; weight: number }[];
}

export interface DataLakeStats {
  provider: string;
  bucketName: string;
  totalFiles: number;
  totalVolumeMB: number;
  freeTierLimitMB: number;
  lastSync: string;
}
