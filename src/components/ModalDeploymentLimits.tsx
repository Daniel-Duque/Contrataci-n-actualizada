import React, { useState } from 'react';
import {
  X,
  Server,
  Cloud,
  Key,
  ShieldAlert,
  HardDrive,
  Cpu,
  Clock,
  HelpCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Terminal,
  AlertTriangle,
  Database,
  GitBranch,
  Layers
} from 'lucide-react';

interface ModalDeploymentLimitsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalDeploymentLimits: React.FC<ModalDeploymentLimitsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'404' | 'llaves' | 'limites' | 'tierra' | 'bd-gratis'>('bd-gratis');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Guía de Despliegue, Llaves & Límites</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Demo vs. On-Premise
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Solución al Error 404, variables en Vercel, cuotas de APIs y arquitectura de servidores en tierra
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('404')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === '404'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>¿Por qué salió Error 404?</span>
          </button>
          <button
            onClick={() => setActiveTab('llaves')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'llaves'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="h-4 w-4 text-emerald-600" />
            <span>Llaves en Vercel / Entornos</span>
          </button>
          <button
            onClick={() => setActiveTab('limites')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'limites'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Límites del Demo & Cuotas</span>
          </button>
          <button
            onClick={() => setActiveTab('tierra')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'tierra'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardDrive className="h-4 w-4 text-purple-600" />
            <span>Servidores en Tierra (On-Premise)</span>
          </button>
          <button
            onClick={() => setActiveTab('bd-gratis')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'bd-gratis'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="h-4 w-4 text-emerald-600" />
            <span>Base de Datos Gratuita & Branch Pruebas</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-sm">

          {/* TAB 1: CAUSA DEL ERROR 404 & SOLUCIÓN */}
          {activeTab === '404' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-amber-900 text-sm">Diagnóstico del "Error de servidor: 404"</h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      El error ocurrió al intentar consultar la ruta local <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/api/secop/contracts</code>.
                      Esto sucede típicamente cuando:
                    </p>
                    <ul className="text-xs text-amber-800 list-disc list-inside space-y-1 pt-1">
                      <li>
                        <strong>En Vercel:</strong> Vercel por defecto solo despliega el frontend compilado en estático (<code className="font-mono">dist/</code>). Si no se define una Serverless Function o <code className="font-mono">vercel.json</code>, cualquier petición a <code className="font-mono">/api/*</code> arroja 404.
                      </li>
                      <li>
                        <strong>En arranque local:</strong> Si la pestaña del navegador cargó milisegundos antes de que el servidor Express en segundo plano terminara de enlazar sus puertos.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-emerald-900 text-sm">Solución Automática Implementada (Resiliencia Total)</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Hemos configurado una <strong>estrategia de contingencia automática (Failover híbrido)</strong>:
                    </p>
                    <ol className="text-xs text-emerald-800 list-decimal list-inside space-y-1 pt-1">
                      <li>El sistema intenta primero comunicarse con el backend <code className="font-mono">/api/secop/contracts</code>.</li>
                      <li>Si detecta un código <strong>404</strong> o servidor inaccesible, el navegador <strong>se conecta directamente a la API de datos abiertos de Colombia (datos.gov.co)</strong> mediante HTTPS con soporte CORS nativo.</li>
                      <li>El algoritmo de scoring y detección de sobrecostos de FiscalSapo se ejecuta directamente en el cliente en milisegundos.</li>
                      <li>Si la API nacional experimenta latencia o caída, recurre inmediatamente al dataset local precargado.</li>
                    </ol>
                    <p className="text-xs font-semibold text-emerald-900 pt-1">
                      Resultado: Tu demo nunca más se quedará en blanco con un error 404, funcione o no el backend en Vercel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Archivo <code className="text-emerald-700">vercel.json</code> incluido para Vercel
                </h4>
                <p className="text-xs text-slate-600">
                  Para que Vercel redirija las rutas de forma adecuada y no arroje 404 en recargas de página:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto relative">
                  <pre>{`{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}</pre>
                  <button
                    onClick={() => copyToClipboard(`{\n  "rewrites": [\n    { "source": "/(.*)", "destination": "/index.html" }\n  ]\n}`, 'vercel-json')}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                    title="Copiar"
                  >
                    {copiedKey === 'vercel-json' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LLAVES Y CONFIGURACIÓN */}
          {activeTab === 'llaves' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">¿Qué llaves o variables necesitas en Vercel?</h3>
                <p className="text-xs text-slate-500">
                  Para correr el <strong>demo actual</strong> no requieres tarjeta de crédito ni llaves de pago obligatorias.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Llave 1: GEMINI_API_KEY */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-700">Recomendada</span>
                    <span className="text-[11px] text-slate-400">Gratis en Google AI Studio</span>
                  </div>
                  <h4 className="font-mono font-bold text-slate-900 text-sm">GEMINI_API_KEY</h4>
                  <p className="text-xs text-slate-600">
                    Habilita el <strong>Examinador RAG con IA</strong> (consultas forenses a los PDFs del contrato) y el dictamen pericial automatizado.
                  </p>
                  <div className="text-xs text-slate-500 pt-1">
                    <strong>Dónde obtenerla:</strong> En <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-medium inline-flex items-center">aistudio.google.com <ExternalLink className="h-3 w-3 ml-0.5" /></a> (sin costo).
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>En Vercel:</strong> <em>Settings → Environment Variables → Key: GEMINI_API_KEY</em>.
                  </div>
                </div>

                {/* Llave 2: SOCRATA_APP_TOKEN */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700">Opcional</span>
                    <span className="text-[11px] text-slate-400">Gratis en datos.gov.co</span>
                  </div>
                  <h4 className="font-mono font-bold text-slate-900 text-sm">SOCRATA_APP_TOKEN</h4>
                  <p className="text-xs text-slate-600">
                    Permite aumentar la cuota de peticiones al portal oficial de datos abiertos de Colombia.
                  </p>
                  <div className="text-xs text-slate-500 pt-1">
                    <strong>Sin Token:</strong> Máximo ~1.000 peticiones al día por IP.
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Con Token:</strong> Hasta 50.000 peticiones diarias sin bloqueos.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pasos para configurar en Vercel Dashboard</h4>
                <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1.5">
                  <li>Ingresa a tu proyecto en <strong>vercel.com</strong>.</li>
                  <li>Ve a la pestaña <strong>Settings</strong> y selecciona <strong>Environment Variables</strong> en el menú lateral.</li>
                  <li>Crea la variable con nombre <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">GEMINI_API_KEY</code> y pega tu llave.</li>
                  <li>Marca los entornos: <strong>Production</strong>, <strong>Preview</strong> y <strong>Development</strong>.</li>
                  <li>Haz clic en <strong>Save</strong> y ejecuta un nuevo <em>Redeploy</em> para que los cambios surtan efecto.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: LÍMITES TÉCNICOS */}
          {activeTab === 'limites' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Límites que debes tener en cuenta en el Demo</h3>
                <p className="text-xs text-slate-500">
                  Cuotas de servicios serverless en nube vs. datos públicos de Colombia
                </p>
              </div>

              <div className="space-y-3">
                {/* Límite 1: Vercel Timeout */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">Timeout de 10 Segundos en Vercel (Hobby)</h4>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Crítico para Scrapers
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      En el plan gratuito de Vercel, cualquier función serverless que tarde más de <strong>10 segundos</strong> es abortada con error <code className="font-mono text-amber-800">504 Gateway Timeout</code>.
                      Por esta razón, descargar 6 PDFs pesados de 50 MB en vivo desde SECOP II durante una sola petición HTTP en Vercel no es viable; se debe hacer de forma asíncrona o mediante un servidor en tierra.
                    </p>
                  </div>
                </div>

                {/* Límite 2: SECOP II WAF y Captcha */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">Bloqueo WAF y Captcha en SECOP II</h4>
                      <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Imperva / Cloudflare
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      El portal <code className="font-mono">community.secop.gov.co</code> bloquea activamente las direcciones IP de centros de datos en la nube (AWS, Google Cloud, Vercel).
                      Por eso implementamos el <strong>Módulo Human-in-the-Loop</strong>: el usuario abre el enlace oficial, resuelve el Captcha con su IP residencial/institucional, y confirma para continuar la extracción.
                    </p>
                  </div>
                </div>

                {/* Límite 3: Gemini Free Tier */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm">Cuota Gratuita de Gemini</h4>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        15 RPM / 1.500 RPD
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      El plan gratuito permite hasta 15 consultas por minuto y 1.500 por día. Para un demo o equipo de trabajo es más que suficiente. Si se supera el límite de velocidad temporalmente, se debe espaciar las consultas unos segundos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARQUITECTURA EN TIERRA (ON-PREMISE) */}
          {activeTab === 'tierra' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Transición a Servidores "En Tierra" (On-Premise)</h3>
                <p className="text-xs text-slate-500">
                  Recomendaciones técnicas cuando conectes la plataforma a infraestructura física institucional
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs">
                    <HardDrive className="h-4 w-4" />
                    <span>Almacenamiento Local (Data Lake)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Monta un almacenamiento <strong>MinIO</strong> (servidor S3 auto-hospedado) o una carpeta compartida en un NAS local. Esto permite indexar miles de PDFs de contratos sin pagar almacenamiento en nubes públicas y cumpliendo políticas de archivo documental (Ley 594 de 2000).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                    <Cpu className="h-4 w-4" />
                    <span>Scrapers Headless sin Límites de Tiempo</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En servidores en tierra no existe el timeout de 10s de Vercel. Puedes programar un demonio en Node.js o Python con <strong>Playwright</strong> que corra durante la noche procesando lotes de 5.000 contratos de SECOP de forma ininterrumpida.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs">
                    <Server className="h-4 w-4" />
                    <span>Base de Datos PostgreSQL + pgvector</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instala PostgreSQL 16 con la extensión <strong>pgvector</strong> en el servidor local. Los embeddings del RAG se indexan con latencias de 1-2 ms y las búsquedas semánticas son prácticamente instantáneas.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Soberanía y Modelos LLM Locales (Ollama)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Si la entidad o cliente no permite enviar información contractual a APIs externas, puedes conectar este frontend a un servidor local con <strong>Ollama</strong> (DeepSeek R1, Llama 3.3 o Mistral) corriendo en GPUs locales Nvidia.
                  </p>
                </div>
              </div>

              {/* Docker One-Liner */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 font-mono">Despliegue On-Premise con Docker</span>
                  <button
                    onClick={() => copyToClipboard(`docker compose up -d`, 'docker-cmd')}
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
                  >
                    {copiedKey === 'docker-cmd' ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-emerald-400 bg-black/40 p-2.5 rounded">
                  docker build -t fiscalsapo-app . && docker run -d -p 3000:3000 --env-file .env fiscalsapo-app
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BASE DE DATOS GRATUITA & BRANCH DE PRUEBAS */}
          {activeTab === 'bd-gratis' && (
            <div className="space-y-6">
              
              {/* Sección 1: Branch de Pruebas */}
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold text-sm">1. Branch de Pruebas ('pruebas') Inicializado</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Activo: git branch pruebas
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ya creamos el branch <code className="text-emerald-300 font-mono">pruebas</code> y generamos el commit con todos los cambios acumulados (failover híbrido, scoring de sobrecosto, esquema de base de datos y scripts).
                </p>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Para empujar este branch a tu repositorio en GitHub / GitLab:</span>
                    <button
                      onClick={() => copyToClipboard(`git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git\ngit push -u origin pruebas`, 'git-push-cmd')}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                    >
                      {copiedKey === 'git-push-cmd' ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>Copiar comandos</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black/50 font-mono text-xs text-emerald-300 overflow-x-auto">
{`git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin pruebas`}
                  </pre>
                </div>
              </div>

              {/* Sección 2: Upgrade y Validación en Vercel */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-emerald-700" />
                  <h4 className="font-bold text-emerald-950 text-sm">2. Cómo hacer el Upgrade y Test en Vercel antes de Producción</h4>
                </div>
                <ol className="text-xs text-emerald-900 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong>Vercel Preview Deployment Automático:</strong> Cuando subes el branch <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">pruebas</code> a GitHub, Vercel no toca tu producción. En su lugar, genera automáticamente un enlace de Preview aislado (ej: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">https://fiscalsapo-git-pruebas-tuusuario.vercel.app</code>).
                  </li>
                  <li>
                    <strong>Configuración de Variables de Entorno en Preview:</strong> En el panel de Vercel (<span className="italic">Project Settings → Environment Variables</span>), puedes marcar que <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">GEMINI_API_KEY</code> aplique específicamente para el entorno <strong>Preview</strong>.
                  </li>
                  <li>
                    <strong>Prueba de Humo (Smoke Test):</strong> Ingresa a la URL de Preview generada por Vercel, verifica que los contratos carguen en modo cliente directo o backend y haz una pregunta en el chat RAG forense.
                  </li>
                  <li>
                    <strong>Pase a Producción Seguro (Zero-Downtime):</strong> Si las pruebas en el branch de pruebas son satisfactorias, abres un <em>Pull Request</em> de <code className="font-mono">pruebas</code> hacia <code className="font-mono">main</code>. Al hacer <em>Merge</em>, Vercel actualiza tu dominio principal de forma instantánea.
                  </li>
                </ol>
              </div>

              {/* Sección 3: Opciones de Bases de Datos Gratuitas */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-slate-800" />
                  <h4 className="font-bold text-slate-900 text-sm">3. Cuatro Alternativas de Base de Datos 100% Gratuitas</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Opción A: Supabase */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">A. Supabase (PostgreSQL)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">500 MB Gratis</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Base de datos relacional SQL completa. Ideal si deseas realizar consultas complejas (<code className="font-mono">JOIN</code>, filtros por contratistas o municipios). Incluye API REST instantánea.
                    </p>
                  </div>

                  {/* Opción B: Cloud Firestore */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">B. Cloud Firestore (Firebase)</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">1 GB Gratis</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Plan Spark gratuito permanente (50.000 lecturas y 20.000 escrituras al día). Integrable con un clic en esta plataforma. Perfecto para almacenar contratos por llave <code className="font-mono">contracts/&#123;contractRef&#125;</code>.
                    </p>
                  </div>

                  {/* Opción C: Turso */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">C. Turso (libSQL / SQLite Serverless)</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">9 GB Gratis</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      SQLite en el borde (Edge) ultra rápido con hasta 500 bases de datos en su plan gratuito. Diseñado específicamente para Serverless y Vercel.
                    </p>
                  </div>

                  {/* Opción D: Navegador / LocalStorage */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">D. Local IndexedDB (Navegador)</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">Ilimitado Local</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Ya implementado en el código: almacena miles de contratos y predicciones directo en el navegador del usuario con cero costo de servidores o infraestructura.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección 4: Esquema Consolidado SQL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-slate-700" />
                    <span className="font-bold text-xs text-slate-900">4. Esquema SQL Consolidado (Llave Primaria + Predicciones)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`CREATE TABLE IF NOT EXISTS contract_predictions (
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
);`, 'sql-schema-cmd')}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center space-x-1"
                  >
                    {copiedKey === 'sql-schema-cmd' ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>Copiar DDL SQL</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS contract_predictions (
  contract_ref VARCHAR(120) PRIMARY KEY, -- Llave oficial SECOP (Ej: CTO-IDU-1482-2024)
  entity_name VARCHAR(255) NOT NULL,
  contractor_name VARCHAR(255),
  initial_value NUMERIC(18,2) NOT NULL,
  total_additions NUMERIC(18,2) DEFAULT 0,
  consolidated_value NUMERIC(18,2) NOT NULL,
  additions_ratio NUMERIC(6,2), -- % Adición sobre el contrato
  overcost_score INTEGER NOT NULL, -- Score de riesgo 0-100
  overcost_risk_level VARCHAR(20) NOT NULL, -- Bajo, Medio, Alto, Crítico
  anomaly_factors TEXT[], -- Alertas detectadas
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                </pre>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>FiscalSapo AI • Arquitectura Híbrida (Web / On-Premise)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            Entendido, volver a la aplicación
          </button>
        </div>

      </div>
    </div>
  );
};
