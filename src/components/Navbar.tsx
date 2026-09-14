import React from 'react';
import { ShieldAlert, Database, Cpu, SearchCode, ExternalLink, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'fiscalsapo' | 'examinador';
  setActiveTab: (tab: 'fiscalsapo' | 'examinador') => void;
  selectedContractRef?: string;
  onOpenMLOps: () => void;
  onOpenDeploymentLimits: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  isLiveSource: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedContractRef,
  onOpenMLOps,
  onOpenDeploymentLimits,
  onRefreshData,
  isRefreshing,
  isLiveSource
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">FiscalSapo</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  SECOP II AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Auditoría Ciudadana y Predicción de Sobrecostos Estatales
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Primary requirement: Dos pestañas) */}
          <nav className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              id="tab-fiscalsapo-btn"
              onClick={() => setActiveTab('fiscalsapo')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'fiscalsapo'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>1. Auditoría & Sobrecosto</span>
            </button>

            <button
              id="tab-examinador-btn"
              onClick={() => setActiveTab('examinador')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all relative ${
                activeTab === 'examinador'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <SearchCode className="h-4 w-4" />
              <span>2. Examinador SECOP & RAG</span>
              {selectedContractRef && (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="refresh-data-btn"
              onClick={onRefreshData}
              disabled={isRefreshing}
              title="Actualizar datos desde datos.gov.co"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              id="open-mlops-modal-btn"
              onClick={onOpenMLOps}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>MLOps & DB</span>
            </button>

            <button
              id="open-deployment-limits-btn"
              onClick={onOpenDeploymentLimits}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 shadow-sm transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Llaves & Límites</span>
            </button>

            <a
              id="datos-gov-link"
              href="https://www.datos.gov.co/resource/p6dx-8zbt.json?$limit=1000"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span>API SECOP</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
