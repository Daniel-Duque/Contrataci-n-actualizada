import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  Building,
  CheckCircle2,
  Sparkles,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { SecopContract } from '../types';
import { formatCOP, formatCompactCOP, formatDate, getRiskColor } from '../utils/formatters';

interface TabFiscalSapoProps {
  contracts: SecopContract[];
  isLoading: boolean;
  selectedContract: SecopContract | null;
  onSelectContract: (contract: SecopContract) => void;
  onInspectDetail: (contract: SecopContract) => void;
  onGoToExaminer: (contract: SecopContract) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedRiskFilter: string;
  setSelectedRiskFilter: (risk: string) => void;
  limit: number;
  setLimit: (limit: number) => void;
  onRefresh: () => void;
}

const RISK_COLORS = {
  Crítico: '#e11d48', // rose-600
  Alto: '#d97706',    // amber-600
  Medio: '#2563eb',   // blue-600
  Bajo: '#059669'     // emerald-600
};

export const TabFiscalSapo: React.FC<TabFiscalSapoProps> = ({
  contracts,
  isLoading,
  selectedContract,
  onSelectContract,
  onInspectDetail,
  onGoToExaminer,
  searchTerm,
  setSearchTerm,
  selectedDept,
  setSelectedDept,
  selectedRiskFilter,
  setSelectedRiskFilter,
  limit,
  setLimit,
  onRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    contracts.forEach(c => {
      if (c.departamento) set.add(c.departamento);
    });
    return ['Todos', ...Array.from(set).sort()];
  }, [contracts]);

  // Filtered dataset
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const matchSearch =
        !searchTerm ||
        (c.referencia_del_contrato && c.referencia_del_contrato.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.nombre_entidad && c.nombre_entidad.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.objeto_del_contrato && c.objeto_del_contrato.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.nom_raz_social_contratista && c.nom_raz_social_contratista.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDept = selectedDept === 'Todos' || c.departamento?.toLowerCase() === selectedDept.toLowerCase();

      const matchRisk = selectedRiskFilter === 'Todos' || c.overcostRiskLevel === selectedRiskFilter;

      return matchSearch && matchDept && matchRisk;
    });
  }, [contracts, searchTerm, selectedDept, selectedRiskFilter]);

  // KPIs
  const totalCount = filteredContracts.length;
  const totalValor = filteredContracts.reduce((acc, c) => acc + (Number(c.valor_del_contrato) || 0), 0);
  const totalAdiciones = filteredContracts.reduce((acc, c) => acc + (Number(c.valor_total_adiciones) || 0), 0);
  const criticalCount = filteredContracts.filter(c => c.overcostRiskLevel === 'Crítico').length;
  const highCount = filteredContracts.filter(c => c.overcostRiskLevel === 'Alto').length;
  const alertPct = totalCount > 0 ? Math.round(((criticalCount + highCount) / totalCount) * 100) : 0;
  const estimatedRiskTotal = filteredContracts.reduce((acc, c) => acc + (Number(c.estimatedOvercostAmount) || 0), 0);

  // Chart Data: Risk Distribution
  const riskPieData = useMemo(() => {
    const counts: Record<string, number> = { Crítico: 0, Alto: 0, Medio: 0, Bajo: 0 };
    filteredContracts.forEach(c => {
      const lvl = c.overcostRiskLevel || 'Bajo';
      if (counts[lvl] !== undefined) counts[lvl]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredContracts]);

  // Chart Data: Top Entities by Overcost Risk
  const topEntitiesData = useMemo(() => {
    const entityMap: Record<string, { totalValor: number; avgRisk: number; count: number }> = {};
    filteredContracts.forEach(c => {
      const ent = c.nombre_entidad || 'Entidad Desconocida';
      const shortName = ent.length > 22 ? ent.slice(0, 20) + '...' : ent;
      if (!entityMap[shortName]) {
        entityMap[shortName] = { totalValor: 0, avgRisk: 0, count: 0 };
      }
      entityMap[shortName].totalValor += Number(c.valor_del_contrato) || 0;
      entityMap[shortName].avgRisk += c.overcostScore || 15;
      entityMap[shortName].count += 1;
    });

    return Object.entries(entityMap)
      .map(([name, stats]) => ({
        name,
        avgRisk: Math.round(stats.avgRisk / stats.count),
        contractsCount: stats.count
      }))
      .sort((a, b) => b.avgRisk - a.avgRisk)
      .slice(0, 5);
  }, [filteredContracts]);

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage) || 1;
  const currentContracts = filteredContracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner / Header informativo de la migración de FiscalSapo */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-2xl shadow-sm border border-slate-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Evolución de FiscalSapo (Streamlit &gt; AI Modern Web)
              </span>
              <span className="text-xs text-slate-400">SECOP II • Datos Abiertos Colombia</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Auditor Forense & Predicción de Sobrecostos en Contratación Pública
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Base de datos en tiempo real de contratos del Estado colombiano procesados mediante el modelo de Machine Learning de detección de sobrecostos, adiciones atípicas y riesgos contractuales.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={onRefresh}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Sincronizar SECOP</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contratos */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Contratos Analizados</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount.toLocaleString('es-CO')}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Límite cargado: {limit} registros</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Building className="h-5 w-5" />
          </div>
        </div>

        {/* Cuantía Total */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Monto Total Contratado</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCompactCOP(totalValor)}</h3>
            <p className="text-xs text-emerald-600 mt-0.5">Adiciones: {formatCompactCOP(totalAdiciones)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* % en Alerta de Sobrecosto */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Alerta de Sobrecosto</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{alertPct}%</h3>
            <p className="text-xs text-rose-700 font-medium mt-0.5">
              {criticalCount} Críticos • {highCount} Altos
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* Monto en Riesgo Estimado */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Sobreprecio Estimado en Riesgo</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{formatCompactCOP(estimatedRiskTotal)}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Según heurística FiscalSapo</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* GRÁFICOS ANALÍTICOS (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart: Distribución del Riesgo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <PieIcon className="h-4 w-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Distribución del Riesgo
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Modelo ML</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} contratos`, 'Cantidad']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {riskPieData.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: RISK_COLORS[item.name as keyof typeof RISK_COLORS] || '#94a3b8' }}
                />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Top 5 Entidades con Mayor Índice de Riesgo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Entidades con Mayor Índice Promedio de Sobrecosto
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">Escala 0 - 100</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEntitiesData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} / 100`, 'Riesgo Promedio']}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="avgRisk" fill="#e11d48" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Algoritmo entrenado con variables de adición, modalidad directa y precios atípicos.</span>
            <span className="font-semibold text-rose-700">Top 5 Alertas</span>
          </p>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="search-contracts-input"
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por objeto, entidad, contratista o número de contrato..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Departamento Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Dpto:</span>
            <select
              id="dept-filter-select"
              value={selectedDept}
              onChange={e => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-44 py-2 px-3 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {departments.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Riesgo Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Riesgo:</span>
            <select
              id="risk-filter-select"
              value={selectedRiskFilter}
              onChange={e => {
                setSelectedRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-36 py-2 px-3 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="Todos">Todos</option>
              <option value="Crítico">Crítico</option>
              <option value="Alto">Alto</option>
              <option value="Medio">Medio</option>
              <option value="Bajo">Bajo</option>
            </select>
          </div>

          {/* Limit selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Límite:</span>
            <select
              id="limit-select"
              value={limit}
              onChange={e => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full md:w-28 py-2 px-3 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>
        </div>

        {/* Resumen de filtros */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Mostrando <strong>{filteredContracts.length}</strong> contratos coincidentes
          </span>
          {(searchTerm || selectedDept !== 'Todos' || selectedRiskFilter !== 'Todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('Todos');
                setSelectedRiskFilter('Todos');
                setCurrentPage(1);
              }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* TABLA DE CONTRATOS AUDITADOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Contrato / Entidad</th>
                <th className="py-3 px-4">Objeto del Contrato</th>
                <th className="py-3 px-4">Cuantía / Adiciones</th>
                <th className="py-3 px-4">Modalidad</th>
                <th className="py-3 px-4">Índice Sobrecosto</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentContracts.length > 0 ? (
                currentContracts.map(contract => {
                  const riskStyle = getRiskColor(contract.overcostRiskLevel);
                  const isSelected = selectedContract?.referencia_del_contrato === contract.referencia_del_contrato;

                  return (
                    <tr
                      key={contract.referencia_del_contrato}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
                    >
                      {/* Referencia & Entidad */}
                      <td className="py-3.5 px-4 align-top w-56">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-slate-900 block line-clamp-1">
                            {contract.referencia_del_contrato}
                          </span>
                          <span className="text-slate-600 block line-clamp-1 font-medium">
                            {contract.nombre_entidad}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {contract.ciudad}, {contract.departamento}
                          </span>
                        </div>
                      </td>

                      {/* Objeto */}
                      <td className="py-3.5 px-4 align-top max-w-sm">
                        <p className="text-slate-700 line-clamp-2 leading-relaxed">
                          {contract.objeto_del_contrato}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Contratista: <span className="font-medium text-slate-600">{contract.nom_raz_social_contratista}</span>
                        </p>
                      </td>

                      {/* Cuantía & Adiciones */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <p className="font-bold text-slate-900">
                          {formatCOP(contract.valor_del_contrato)}
                        </p>
                        {Number(contract.valor_total_adiciones) > 0 ? (
                          <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                            +{formatCOP(contract.valor_total_adiciones)} adic.
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400">Sin adición</p>
                        )}
                      </td>

                      {/* Modalidad */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {contract.modalidad_de_contratacion || 'N/A'}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {contract.tipo_de_contrato || 'General'}
                        </span>
                      </td>

                      {/* Índice de Riesgo Sobrecosto */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${riskStyle.badge}`}>
                              {contract.overcostRiskLevel} ({contract.overcostScore}/100)
                            </span>
                          </div>
                          {contract.estimatedOvercostAmount ? (
                            <span className="text-[10px] text-rose-700 block font-medium">
                              Riesgo: {formatCompactCOP(contract.estimatedOvercostAmount)}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            id={`inspect-${contract.referencia_del_contrato}`}
                            onClick={() => onInspectDetail(contract)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Ver análisis forense y detalles"
                          >
                            Detalle
                          </button>
                          <button
                            id={`examinar-${contract.referencia_del_contrato}`}
                            onClick={() => onGoToExaminer(contract)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1 transition-colors"
                            title="Examinar expediente SECOP y consultar con RAG"
                          >
                            <span>Examinar SECOP</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ShieldAlert className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">No se encontraron contratos con estos filtros</p>
                    <p className="text-xs text-slate-400">Prueba ajustando el término de búsqueda o seleccionando otro departamento.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredContracts.length} contratos)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
