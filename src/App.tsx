import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TabFiscalSapo } from './components/TabFiscalSapo';
import { TabExaminadorSecop } from './components/TabExaminadorSecop';
import { ModalContractDetail } from './components/ModalContractDetail';
import { ModalMLOps } from './components/ModalMLOps';
import { ModalDeploymentLimits } from './components/ModalDeploymentLimits';
import { fetchSecopContracts } from './services/contractService';
import { SecopContract } from './types';
import { AlertTriangle, Info, CheckCircle2, ShieldCheck, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'fiscalsapo' | 'examinador'>('fiscalsapo');
  const [contracts, setContracts] = useState<SecopContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveSource, setIsLiveSource] = useState(false);
  const [sourceMode, setSourceMode] = useState<'backend-api' | 'client-direct' | 'fallback-cache'>('backend-api');

  // Selected contract for deep dive & Tab 2 inspection
  const [selectedContract, setSelectedContract] = useState<SecopContract | null>(null);

  // Modals
  const [detailModalContract, setDetailModalContract] = useState<SecopContract | null>(null);
  const [isMLOpsModalOpen, setIsMLOpsModalOpen] = useState(false);
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('Todos');
  const [limit, setLimit] = useState(100);

  // Fetch contracts using resilient service (avoids 404 on Vercel or offline)
  const fetchContracts = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSecopContracts(limit, forceRefresh);
      setContracts(result.contracts);
      setIsLiveSource(result.isLiveSource);
      setSourceMode(result.sourceMode);

      if (!selectedContract && result.contracts.length > 0) {
        setSelectedContract(result.contracts[0]);
      }
    } catch (err) {
      console.error('Error cargando contratos:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [limit, selectedContract]);

  useEffect(() => {
    fetchContracts();
  }, [limit]);

  // Handle switching to Tab 2 with selected contract
  const handleGoToExaminer = (contract: SecopContract) => {
    setSelectedContract(contract);
    setActiveTab('examinador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navbar Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedContractRef={selectedContract?.referencia_del_contrato}
        onOpenMLOps={() => setIsMLOpsModalOpen(true)}
        onOpenDeploymentLimits={() => setIsDeploymentModalOpen(true)}
        onRefreshData={() => fetchContracts(true)}
        isRefreshing={isLoading}
        isLiveSource={isLiveSource}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Banner informativo de modo de conexión / contingencia */}
        {sourceMode === 'client-direct' && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="font-semibold">Modo Cliente Directo Activo:</span>
              <span>Conectado directamente a la API de datos abiertos de Colombia (datos.gov.co). Sobrecostos calculados en el navegador.</span>
            </div>
            <button
              onClick={() => setIsDeploymentModalOpen(true)}
              className="font-bold underline text-emerald-800 hover:text-emerald-950 shrink-0"
            >
              Ver guía de Vercel & Límites →
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDeploymentModalOpen(true)}
                className="text-xs font-semibold text-rose-900 underline hover:no-underline"
              >
                ¿Por qué ocurrió?
              </button>
              <button
                onClick={() => fetchContracts(true)}
                className="text-xs font-bold text-rose-900 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {isLoading && contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-slate-800">Conectando con SECOP II y datos.gov.co...</p>
              <p className="text-xs text-slate-500">
                Procesando dataset y aplicando modelo de detección de sobrecostos FiscalSapo
              </p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'fiscalsapo' ? (
              <TabFiscalSapo
                contracts={contracts}
                isLoading={isLoading}
                selectedContract={selectedContract}
                onSelectContract={setSelectedContract}
                onInspectDetail={setDetailModalContract}
                onGoToExaminer={handleGoToExaminer}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDept={selectedDept}
                setSelectedDept={setSelectedDept}
                selectedRiskFilter={selectedRiskFilter}
                setSelectedRiskFilter={setSelectedRiskFilter}
                limit={limit}
                setLimit={setLimit}
                onRefresh={() => fetchContracts(true)}
              />
            ) : (
              <TabExaminadorSecop
                selectedContract={selectedContract}
                allContracts={contracts}
                onSelectContract={setSelectedContract}
                onGoToFiscalSapo={() => setActiveTab('fiscalsapo')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            FiscalSapo AI • Plataforma de Auditoría Ciudadana en Contratación Estatal de Colombia amparada bajo la Ley 1712 de 2014.
          </p>
          <div className="flex items-center space-x-3">
            <span>Datos Abiertos: SECOP II</span>
            <span>•</span>
            <button
              onClick={() => setIsMLOpsModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Arquitectura MLOps
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Detalle Forense del Contrato */}
      <ModalContractDetail
        contract={detailModalContract}
        onClose={() => setDetailModalContract(null)}
        onGoToExaminer={handleGoToExaminer}
      />

      {/* Modal de MLOps y Guía de Bases de Datos Gratuitas */}
      <ModalMLOps
        isOpen={isMLOpsModalOpen}
        onClose={() => setIsMLOpsModalOpen(false)}
      />

      {/* Modal de Guía de Despliegue, Llaves en Vercel & Límites On-Premise */}
      <ModalDeploymentLimits
        isOpen={isDeploymentModalOpen}
        onClose={() => setIsDeploymentModalOpen(false)}
      />
    </div>
  );
}
