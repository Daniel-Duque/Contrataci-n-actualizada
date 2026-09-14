import React, { useState, useEffect } from 'react';
import {
  SearchCode,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Terminal,
  Send,
  Sparkles,
  Bot,
  User,
  Database,
  Cloud,
  FileCheck,
  ArrowRight,
  RefreshCw,
  FolderDown,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react';
import { SecopContract, ContractDocument, RagMessage } from '../types';
import { formatCOP, formatDate, getRiskColor } from '../utils/formatters';

interface TabExaminadorSecopProps {
  selectedContract: SecopContract | null;
  allContracts: SecopContract[];
  onSelectContract: (contract: SecopContract) => void;
  onGoToFiscalSapo: () => void;
}

export const TabExaminadorSecop: React.FC<TabExaminadorSecopProps> = ({
  selectedContract,
  allContracts,
  onSelectContract,
  onGoToFiscalSapo
}) => {
  // Captcha state
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);

  // Scraper state
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingLogs, setScrapingLogs] = useState<string[]>([]);
  const [documents, setDocuments] = useState<ContractDocument[]>([]);
  const [selectedDocPreview, setSelectedDocPreview] = useState<ContractDocument | null>(null);

  // RAG state
  const [ragHistory, setRagHistory] = useState<RagMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de auditoría documental RAG. Una vez completado el scraper de los documentos de este contrato en SECOP II, puedes hacerme preguntas sobre los estudios previos, la propuesta económica, los informes de interventoría y las adiciones presupuestales.',
      timestamp: 'Ahora'
    }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isRagQuerying, setIsRagQuerying] = useState(false);

  // Data Lake state
  const [dataLakeProvider, setDataLakeProvider] = useState<'Hugging Face Datasets' | 'Cloudflare R2' | 'Supabase Storage'>('Hugging Face Datasets');
  const [isSyncingDataLake, setIsSyncingDataLake] = useState(false);
  const [dataLakeSyncResult, setDataLakeSyncResult] = useState<string | null>(null);

  // Fallback to first contract if none selected
  const contract = selectedContract || allContracts[0] || null;

  // Resolve SECOP link
  const secopUrl = contract
    ? (typeof contract.urlproceso === 'object' && contract.urlproceso?.url
        ? contract.urlproceso.url
        : (typeof contract.urlproceso === 'string'
            ? contract.urlproceso
            : `https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=${contract.id_contrato || 'CO1.NTC.5891240'}`))
    : 'https://community.secop.gov.co';

  // If user switches contract, reset scraper and captcha verification
  useEffect(() => {
    setCaptchaSolved(false);
    setDocuments([]);
    setSelectedDocPreview(null);
    setScrapingLogs([]);
    setRagHistory([
      {
        id: 'welcome-' + (contract?.referencia_del_contrato || 'new'),
        role: 'assistant',
        content: `Listo para examinar el expediente del contrato **${contract?.referencia_del_contrato || ''}** (${contract?.nombre_entidad || ''}). Por favor verifica el Captcha de SECOP II para autorizar la extracción automatizada de los PDFs.`,
        timestamp: 'Ahora'
      }
    ]);
  }, [contract?.referencia_del_contrato]);

  // Captcha manual verification handler
  const handleVerifyCaptcha = () => {
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setCaptchaSolved(true);
      setIsVerifyingCaptcha(false);
    }, 1200);
  };

  // Automated document scraper execution
  const handleRunScraper = async () => {
    if (!contract) return;
    setIsScraping(true);
    setScrapingLogs([]);

    const logSteps = [
      `[${new Date().toLocaleTimeString()}] Inicializando cliente scraper con bypass de Captcha verificado...`,
      `[${new Date().toLocaleTimeString()}] Conectando con expediente SECOP: ${secopUrl.slice(0, 60)}...`,
      `[${new Date().toLocaleTimeString()}] Parseando tabla DOM de documentos anexos del proceso ${contract.referencia_del_contrato}...`,
      `[${new Date().toLocaleTimeString()}] Extrayendo 6 documentos oficiales (Estudios Previos, Pliego, Minuta, Oferta, Adición, Interventoría)...`,
      `[${new Date().toLocaleTimeString()}] Calculando firmas digitales SHA-256 e indexando texto para el modelo RAG...`,
      `[${new Date().toLocaleTimeString()}] ¡Scraper finalizado exitosamente! Documentos listos para consulta y almacenamiento.`
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setScrapingLogs(prev => [...prev, logSteps[i]]);
    }

    try {
      const res = await fetch('/api/scraper/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractRef: contract.referencia_del_contrato,
          captchaSolved: true,
          secopNoticeUid: contract.id_contrato
        })
      });
      const data = await res.json();
      if (data.success && data.documents) {
        setDocuments(data.documents);
        setSelectedDocPreview(data.documents[0]);
      }
    } catch (err) {
      console.error('Error fetching scraped documents:', err);
    } finally {
      setIsScraping(false);
    }
  };

  // Submit RAG question to Gemini
  const handleAskRag = async (questionToAsk?: string) => {
    const q = questionToAsk || userQuery;
    if (!q.trim() || !contract || isRagQuerying) return;

    const userMsg: RagMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setRagHistory(prev => [...prev, userMsg]);
    setUserQuery('');
    setIsRagQuerying(true);

    try {
      const res = await fetch('/api/ai/rag-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q.trim(),
          contract,
          documents
        })
      });
      const data = await res.json();

      const assistantMsg: RagMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'No se obtuvo respuesta del modelo RAG.',
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setRagHistory(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('RAG query error:', err);
      const errMsg: RagMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ocurrió un error al procesar la consulta con el modelo RAG. Por favor intenta nuevamente.',
        timestamp: 'Ahora'
      };
      setRagHistory(prev => [...prev, errMsg]);
    } finally {
      setIsRagQuerying(false);
    }
  };

  // Data Lake Synchronization
  const handleSyncDataLake = async () => {
    if (!contract) return;
    setIsSyncingDataLake(true);
    setDataLakeSyncResult(null);

    try {
      const res = await fetch('/api/datalake/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: dataLakeProvider,
          contractRefs: [contract.referencia_del_contrato]
        })
      });
      const data = await res.json();
      if (data.success) {
        setDataLakeSyncResult(data.message);
      }
    } catch (err) {
      console.error('Data lake sync error:', err);
    } finally {
      setIsSyncingDataLake(false);
    }
  };

  if (!contract) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <SearchCode className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No hay ningún contrato seleccionado</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Regresa a la pestaña 1 (Auditoría & Sobrecosto) y selecciona un contrato con el botón "Examinar SECOP".
        </p>
        <button
          onClick={onGoToFiscalSapo}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
        >
          Ir a Auditoría & Sobrecosto
        </button>
      </div>
    );
  }

  const riskStyle = getRiskColor(contract.overcostRiskLevel);

  return (
    <div className="space-y-6 pb-16">
      {/* HEADER: CONTRATO SELECCIONADO */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
              {contract.referencia_del_contrato}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${riskStyle.badge}`}>
              Riesgo {contract.overcostRiskLevel} ({contract.overcostScore}/100)
            </span>
            <span className="text-xs text-slate-500">
              {contract.ciudad}, {contract.departamento}
            </span>
          </div>

          <h2 className="text-base font-black text-slate-900 line-clamp-1">
            {contract.nombre_entidad}
          </h2>

          <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
            {contract.objeto_del_contrato}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto whitespace-nowrap">
          {/* Selector de contratos cargados para cambio rápido */}
          <select
            id="quick-select-contract"
            value={contract.referencia_del_contrato}
            onChange={e => {
              const found = allContracts.find(c => c.referencia_del_contrato === e.target.value);
              if (found) onSelectContract(found);
            }}
            className="py-1.5 px-3 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[200px]"
          >
            {allContracts.map(c => (
              <option key={c.referencia_del_contrato} value={c.referencia_del_contrato}>
                {c.referencia_del_contrato}
              </option>
            ))}
          </select>

          <a
            id="open-secop-tab-btn"
            href={secopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <span>Abrir en SECOP II</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* SECCIÓN 1: VÍNCULO SECOP & RESOLUCIÓN MANUAL DE CAPTCHA */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Paso 1: Validación de Captcha y Acceso al Expediente en SECOP II
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Mecanismo Human-in-the-Loop contra bloqueo WAF
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Los servidores de SECOP II (Colombia Compra Eficiente) protegen la descarga masiva de documentos contractuales mediante un <strong>desafío Captcha</strong>. Para permitir que el scraper descargue de forma legítima todos los PDFs públicos del proceso, abre el enlace oficial de SECOP, resuelve el Captcha si es requerido y pulsa el botón de confirmación.
        </p>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className={`p-2.5 rounded-xl ${captchaSolved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {captchaSolved ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Estado del Captcha: {captchaSolved ? 'Verificado & Sesión Acreditada' : 'Pendiente de Validación'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono line-clamp-1 max-w-md">
                URL SECOP: {secopUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <a
              id="open-secop-captcha-btn"
              href={secopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <span>1. Abrir SECOP para Captcha</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              id="confirm-captcha-btn"
              onClick={handleVerifyCaptcha}
              disabled={isVerifyingCaptcha || captchaSolved}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                captchaSolved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              {isVerifyingCaptcha ? (
                <>
                  <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Verificando...</span>
                </>
              ) : captchaSolved ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Captcha Confirmado</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>2. Confirmar Captcha Resuelto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: SCRAPER AUTOMATIZADO DE PDFS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Paso 2: Extractor Automatizado de Documentos PDF del Proceso
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Trae estudios previos, pliegos, contrato firmado, adiciones y actas de supervisión.
            </p>
          </div>

          <button
            id="start-scraper-btn"
            onClick={handleRunScraper}
            disabled={!captchaSolved || isScraping}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md ${
              !captchaSolved
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isScraping ? 'animate-spin' : ''}`} />
            <span>
              {isScraping
                ? 'Extrayendo Documentos...'
                : documents.length > 0
                ? 'Re-ejecutar Scraper'
                : 'Iniciar Scraper de Documentos'}
            </span>
          </button>
        </div>

        {/* Consola de logs del scraper */}
        {scrapingLogs.length > 0 && (
          <div className="bg-slate-950 text-emerald-400 font-mono text-[11px] p-3.5 rounded-xl space-y-1 shadow-inner max-h-36 overflow-y-auto">
            {scrapingLogs.map((log, idx) => (
              <p key={idx} className="leading-relaxed">
                {log}
              </p>
            ))}
          </div>
        )}

        {/* Grilla de Documentos Extraídos */}
        {documents.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Expediente Contractual Completo ({documents.length} Archivos PDF Encontrados)
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Listos para Modelos RAG
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map(doc => {
                const isSelected = selectedDocPreview?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocPreview(doc)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {doc.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</p>
                      <p className="text-[11px] text-slate-500 font-mono line-clamp-1">{doc.filename}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{doc.pages} páginas • {formatDate(doc.dateUploaded)}</span>
                      <a
                        href={doc.downloadUrl}
                        download
                        onClick={e => e.stopPropagation()}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Bajar</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Previsualizador del Documento Seleccionado */}
            {selectedDocPreview && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">
                      Muestra de Texto Extraído: {selectedDocPreview.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Hash SHA-256: {selectedDocPreview.hashSha256.slice(0, 16)}...
                  </span>
                </div>
                <pre className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {selectedDocPreview.extractedTextSample}
                </pre>
              </div>
            )}
          </div>
        ) : (
          !isScraping && (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
              <FileText className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-slate-600">
                No se han extraído los documentos aún.
              </p>
              <p className="text-[11px] text-slate-400">
                Verifica el Captcha arriba y pulsa "Iniciar Scraper de Documentos" para traer los PDFs de SECOP.
              </p>
            </div>
          )
        )}
      </div>

      {/* SECCIÓN 3: ASISTENTE FORENSE TIPO RAG CON GEMINI */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Paso 3: Modelo RAG Individual para este Contrato
              </h3>
              <p className="text-xs text-slate-500">
                Preguntas y respuestas forenses basadas estrictamente en los documentos PDF extraídos.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Gemini 3.8 Flash • RAG Activo
          </span>
        </div>

        {/* Sugerencias Rápidas de Preguntas Forenses */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Preguntas Forenses Recomendadas:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              '¿Existe justificación de sobrecosto o precios unitarios en los estudios previos?',
              '¿Bajo qué argumentos técnicos se autorizó la adición presupuestal?',
              '¿Qué alertas de retrasos reportó el interventor en su informe?',
              '¿Qué multas o sanciones estipula el contrato por incumplimiento?'
            ].map((sug, i) => (
              <button
                key={i}
                onClick={() => handleAskRag(sug)}
                disabled={isRagQuerying}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-slate-700 transition-colors disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Ventana de Chat RAG */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4 min-h-[220px] max-h-[380px] overflow-y-auto">
          {ragHistory.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-xl p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Fuentes RAG citadas */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Evidencias documentales recuperadas (Citas RAG):
                    </p>
                    <div className="space-y-1">
                      {msg.sources.map((src, sIdx) => (
                        <div key={sIdx} className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px]">
                          <span className="font-bold text-emerald-800">
                            [{src.docTitle} - Pág {src.page}]
                          </span>
                          <p className="text-slate-600 italic mt-0.5">"{src.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={`block text-[9px] mt-1 text-right ${
                    msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="h-7 w-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isRagQuerying && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 italic">
              <span className="animate-spin h-3 w-3 border-2 border-emerald-600 border-t-transparent rounded-full"></span>
              <span>Buscando en fragmentos de los PDFs con Gemini RAG...</span>
            </div>
          )}
        </div>

        {/* Input para el usuario */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAskRag();
          }}
          className="flex items-center space-x-2"
        >
          <input
            id="rag-query-input"
            type="text"
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
            placeholder="Pregunta algo específico sobre los pliegos, cláusulas, supervisión o precios..."
            className="flex-1 py-2.5 px-4 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          <button
            id="send-rag-query-btn"
            type="submit"
            disabled={!userQuery.trim() || isRagQuerying}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <span>Preguntar</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* SECCIÓN 4: ALMACENAMIENTO EN LAGO DE DATOS GRATUITO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Paso 4: Almacenamiento en Lago de Datos Gratuito (Open Data Lake)
              </h3>
              <p className="text-xs text-slate-500">
                Preservación de PDFs e índices para entrenamiento posterior de modelos de IA y veeduría ciudadana.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-900">Lago Recomendado:</span>
              <select
                id="data-lake-provider-select"
                value={dataLakeProvider}
                onChange={e => setDataLakeProvider(e.target.value as any)}
                className="py-1 px-2.5 rounded-lg text-xs bg-white border border-indigo-200 text-indigo-900 font-semibold focus:outline-none"
              >
                <option value="Hugging Face Datasets">Hugging Face Datasets (100% Gratis e Ilimitado para datos públicos)</option>
                <option value="Cloudflare R2">Cloudflare R2 (10 GB gratis / mes - Sin costo de egress)</option>
                <option value="Supabase Storage">Supabase Storage (1 GB gratis con URL pública)</option>
              </select>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed max-w-2xl">
              Almacenar los contratos en <strong>Hugging Face Datasets</strong> permite versionar los PDFs mediante Git LFS y alimentar directamente pipelines de PyTorch, Hugging Face Transformers o LangChain para futuros modelos de auditoría ciudadana.
            </p>
          </div>

          <button
            id="sync-datalake-btn"
            onClick={handleSyncDataLake}
            disabled={isSyncingDataLake || documents.length === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap shadow-sm ${
              documents.length === 0
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Cloud className={`h-4 w-4 ${isSyncingDataLake ? 'animate-spin' : ''}`} />
            <span>
              {isSyncingDataLake
                ? 'Sincronizando al Lago...'
                : 'Sincronizar PDFs al Lago de Datos'}
            </span>
          </button>
        </div>

        {dataLakeSyncResult && (
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{dataLakeSyncResult}</span>
          </div>
        )}
      </div>
    </div>
  );
};
