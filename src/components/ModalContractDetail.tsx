import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, Sparkles, Building2, MapPin, DollarSign, Calendar, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { SecopContract } from '../types';
import { formatCOP, formatDate, getRiskColor } from '../utils/formatters';

interface ModalContractDetailProps {
  contract: SecopContract | null;
  onClose: () => void;
  onGoToExaminer: (contract: SecopContract) => void;
}

export const ModalContractDetail: React.FC<ModalContractDetailProps> = ({
  contract,
  onClose,
  onGoToExaminer
}) => {
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  if (!contract) return null;

  const riskColors = getRiskColor(contract.overcostRiskLevel);
  const valor = Number(contract.valor_del_contrato) || 0;
  const adiciones = Number(contract.valor_total_adiciones) || 0;
  const ratioAdicion = valor > 0 ? (adiciones / valor) * 100 : 0;

  const secopUrl = typeof contract.urlproceso === 'object' && contract.urlproceso?.url
    ? contract.urlproceso.url
    : (typeof contract.urlproceso === 'string' ? contract.urlproceso : `https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=${contract.id_contrato || 'CO1.NTC.000'}`);

  const handleRunAiAudit = async () => {
    setAnalyzingWithAI(true);
    try {
      const res = await fetch('/api/ai/predict-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract })
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.aiForensicReport);
      }
    } catch (err) {
      console.error('AI audit error:', err);
    } finally {
      setAnalyzingWithAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                {contract.referencia_del_contrato}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${riskColors.badge}`}>
                Riesgo {contract.overcostRiskLevel || 'Bajo'} ({contract.overcostScore || 15}/100)
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 line-clamp-1">
              {contract.nombre_entidad}
            </h2>
          </div>
          <button
            id="close-contract-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Objeto */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Objeto del Contrato
            </h3>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {contract.objeto_del_contrato}
            </p>
          </div>

          {/* Grid de Metadatos Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Valor Inicial</p>
                <p className="text-sm font-bold text-slate-900">{formatCOP(contract.valor_del_contrato)}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Adiciones Presupuestales</p>
                <p className="text-sm font-bold text-slate-900">
                  {formatCOP(contract.valor_total_adiciones || 0)} ({ratioAdicion.toFixed(1)}%)
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Contratista</p>
                <p className="text-sm font-bold text-slate-900 line-clamp-1">
                  {contract.nom_raz_social_contratista}
                </p>
                <p className="text-xs text-slate-400">NIT: {contract.identificacion_del_contratista || 'N/A'}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Ubicación</p>
                <p className="text-sm font-bold text-slate-900">{contract.ciudad}, {contract.departamento}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Modalidad & Tipo</p>
                <p className="text-xs font-semibold text-slate-900">{contract.modalidad_de_contratacion}</p>
                <p className="text-xs text-slate-500">{contract.tipo_de_contrato}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Plazo y Firma</p>
                <p className="text-sm font-bold text-slate-900">{contract.plazo_de_ejec_del_contrato || '30'} días</p>
                <p className="text-xs text-slate-400">Firma: {formatDate(contract.fecha_de_firma)}</p>
              </div>
            </div>
          </div>

          {/* Factores de Anomalía Detectados por el Modelo */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Diagnóstico de Anomalías y Factores de Riesgo (Modelo FiscalSapo)</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-800">
              {contract.anomalyFactors && contract.anomalyFactors.length > 0 ? (
                contract.anomalyFactors.map((fact, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span>{fact}</span>
                  </li>
                ))
              ) : (
                <li className="text-emerald-700 flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Sin anomalías presupuestales atípicas detectadas.</span>
                </li>
              )}
            </ul>
            {contract.estimatedOvercostAmount ? (
              <p className="text-xs font-semibold text-rose-700 pt-1 border-t border-amber-200/60">
                Sobreprecio Estimado en Riesgo: {formatCOP(contract.estimatedOvercostAmount)}
              </p>
            ) : null}
          </div>

          {/* AI Forensic Deep Report */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">Auditor Forense con Inteligencia Artificial (Gemini)</h4>
              </div>
              <button
                id="run-ai-audit-btn"
                onClick={handleRunAiAudit}
                disabled={analyzingWithAI}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                {analyzingWithAI ? (
                  <>
                    <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Analizando con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Ejecutar Dictamen Forense</span>
                  </>
                )}
              </button>
            </div>

            {aiReport ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">Dictamen del Auditor:</p>
                  <p>{aiReport.resumen_forense}</p>
                </div>

                {aiReport.alertas_especificas && (
                  <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-200 text-xs">
                    <p className="font-semibold text-rose-900 mb-1">Alertas Específicas de Contratación:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-rose-800">
                      {aiReport.alertas_especificas.map((a: string, i: number) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiReport.recomendaciones_veeduria && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs">
                    <p className="font-semibold text-blue-900 mb-1">Recomendaciones para Veeduría Ciudadana:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                      {aiReport.recomendaciones_veeduria.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Haz clic en "Ejecutar Dictamen Forense" para evaluar este contrato con el modelo de lenguaje de Gemini, contrastando plazos, modalidad y posibles riesgos de colusión o sobrecosto según la Ley 80.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            id="view-in-secop-link"
            href={secopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ExternalLink className="h-4 w-4 text-slate-500" />
            <span>Ver Expediente Directo en SECOP II</span>
          </a>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              id="transfer-to-examiner-btn"
              onClick={() => {
                onGoToExaminer(contract);
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Examinar en Pestaña 2 (SECOP + RAG)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
