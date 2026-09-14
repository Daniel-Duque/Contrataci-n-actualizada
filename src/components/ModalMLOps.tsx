import React, { useState } from 'react';
import { X, Cpu, Database, Cloud, Activity, CheckCircle2, GitBranch, RefreshCw, Layers, ShieldCheck, Terminal, Copy, Check } from 'lucide-react';

interface ModalMLOpsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalMLOps: React.FC<ModalMLOpsProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [retrainingState, setRetrainingState] = useState<'idle' | 'running' | 'completed'>('idle');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerRetraining = () => {
    setRetrainingState('running');
    setTimeout(() => {
      setRetrainingState('completed');
      setTimeout(() => setRetrainingState('idle'), 4000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Cpu className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-white">
                MLOps & Arquitectura de Base de Datos / Data Lake Gratuita
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Operación continua del modelo de sobrecosto FiscalSapo e integración con servicios cloud sin costo.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[78vh] overflow-y-auto">
          {/* SECCIÓN 1: PIPELINE MLOPS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Pipeline MLOps y Operación Continua del Modelo
                </h3>
              </div>
              <button
                onClick={handleTriggerRetraining}
                disabled={retrainingState === 'running'}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${retrainingState === 'running' ? 'animate-spin text-emerald-400' : ''}`} />
                <span>
                  {retrainingState === 'running'
                    ? 'Ejecutando Pipeline...'
                    : retrainingState === 'completed'
                    ? 'Modelo Reentrenado v2.4.2'
                    : 'Re-entrenar Modelo (CI/CD)'}
                </span>
              </button>
            </div>

            {/* Pipeline Stage Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</div>
                  <span>Ingesta Continua</span>
                </div>
                <p className="text-xs text-slate-600">
                  Sincronización horaria con Socrata API (<code className="text-[11px] bg-slate-200 px-1 rounded">p6dx-8zbt.json</code>). Ingesta incremental por timestamp de firma.
                </p>
                <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  ETL Activo
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px]">2</div>
                  <span>Feature Store</span>
                </div>
                <p className="text-xs text-slate-600">
                  Ratios de adición, cuantía vs histórico de categoría, días de ejecución y embeddings TF-IDF del objeto contractual con Feast/DuckDB.
                </p>
                <span className="inline-block text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  28 Features
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">3</div>
                  <span>Experiment Tracking</span>
                </div>
                <p className="text-xs text-slate-600">
                  Registro de métricas con MLflow / DVC. Modelo campeón actual: <strong>XGBoost Ensemble</strong> (AUC-ROC: 0.923, F1: 0.884).
                </p>
                <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  v2.4.1 en Producción
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <div className="h-5 w-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">4</div>
                  <span>Drift & Monitoring</span>
                </div>
                <p className="text-xs text-slate-600">
                  Detección de Data Drift (Evidently AI) cuando cambian las modalidades contractuales o sube la inflación de obras viales.
                </p>
                <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Deriva: Normal (&lt; 4%)
                </span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: BASES DE DATOS GRATUITAS */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Opciones y Recomendaciones de Base de Datos Gratuita
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción 1: Supabase */}
              <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <h4 className="font-bold text-slate-900 text-sm">Supabase (PostgreSQL + pgvector)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
                    RECOMENDADA #1
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Plan Gratuito:</strong> 500 MB de base de datos PostgreSQL + 1 GB de almacenamiento de archivos + extensión <code className="text-emerald-700 font-mono">pgvector</code> nativa para RAG.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Ideal para almacenar contratos de SECOP y los embeddings vectoriales de los PDFs.</li>
                  <li>• API REST instantánea y soporte nativo de SQL.</li>
                </ul>
                <div className="bg-slate-900 p-2.5 rounded-lg text-emerald-400 font-mono text-[11px] flex items-center justify-between">
                  <span>npx create-next-app --example with-supabase</span>
                  <button
                    onClick={() => handleCopy('npx create-next-app --example with-supabase', 'supa')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedId === 'supa' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Opción 2: Neon Serverless Postgres / Vercel Postgres */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    <h4 className="font-bold text-slate-900 text-sm">Neon / Vercel Postgres</h4>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    IDEAL PARA MLOPS
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Plan Gratuito:</strong> 0.5 GB de almacenamiento, autosuspend para ahorro de recursos, y <em>branching</em> de base de datos como ramas de Git.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Se integra con 1 clic en Vercel como "Vercel Postgres".</li>
                  <li>• Permite crear una réplica de base de datos en 1 segundo para entrenar modelos sin afectar producción.</li>
                </ul>
                <div className="bg-slate-900 p-2.5 rounded-lg text-indigo-300 font-mono text-[11px] flex items-center justify-between">
                  <span>POSTGRES_PRISMA_URL=postgres://neon.tech/secop</span>
                  <button
                    onClick={() => handleCopy('POSTGRES_PRISMA_URL=postgres://neon.tech/secop', 'neon')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedId === 'neon' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Opción 3: Turso LibSQL */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                    <h4 className="font-bold text-slate-900 text-sm">Turso (SQLite Distribuido en el Edge)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">
                    MÁS CAPACIDAD (9 GB)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Plan Gratuito:</strong> 9 GB de almacenamiento y 500 bases de datos gratis.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Latencia ultra baja (&lt; 10ms) en cualquier región.</li>
                  <li>• Cero mantenimiento, compatible con la API de SQLite estándar.</li>
                </ul>
              </div>

              {/* Opción 4: DuckDB + Parquet */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <h4 className="font-bold text-slate-900 text-sm">DuckDB Embebido (Formato Parquet)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    ANALÍTICA LOCAL
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>100% Gratuito y Open Source:</strong> Corre en el backend o en el navegador vía WebAssembly sin pagar ningún servidor.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Lee millones de contratos directamente de archivos Parquet en milisegundos.</li>
                  <li>• Exportable a Data Lakes en la nube sin costo.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: DATA LAKES GRATUITOS PARA PDFS */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Recomendación de Lago de Datos (Data Lake) Gratuito para PDFs Públicos
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span>Hugging Face Hub / Datasets (La Mejor Opción para Datos Públicos)</span>
                    <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-800 text-[10px] font-bold">100% GRATIS</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Al tratarse de <strong>información pública estatal de Colombia amparada por la Ley de Transparencia (Ley 1712 de 2014)</strong>, Hugging Face permite alojar datasets públicos sin límite de almacenamiento utilizando Git LFS (Large File Storage).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3 rounded-lg border border-sky-200 text-xs">
                  <p className="font-bold text-slate-800">Ventaja 1: Integración con IA</p>
                  <p className="text-slate-500 mt-0.5">
                    Permite cargar los PDFs y metadatos con 1 línea de Python: <code className="bg-slate-100 px-1">load_dataset("usuario/secop-lake")</code>.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-sky-200 text-xs">
                  <p className="font-bold text-slate-800">Ventaja 2: Cloudflare R2 (Alternativa)</p>
                  <p className="text-slate-500 mt-0.5">
                    10 GB gratis mensuales con <strong>cero costo de egress</strong> (ideal si no deseas que los archivos sean abiertos en Hugging Face).
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-sky-200 text-xs">
                  <p className="font-bold text-slate-800">Ventaja 3: Internet Archive</p>
                  <p className="text-slate-500 mt-0.5">
                    Preservación perpetua para veedurías ciudadanas e investigaciones anticorrupción en Colombia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
          >
            Entendido, volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
};
