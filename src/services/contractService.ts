import { SecopContract } from '../types';
import { enrichContractsWithScores, FALLBACK_SECOP_CONTRACTS } from '../utils/scoring';

export interface FetchContractsResult {
  contracts: SecopContract[];
  isLiveSource: boolean;
  sourceMode: 'backend-api' | 'client-direct' | 'fallback-cache';
  message?: string;
}

export async function fetchSecopContracts(
  limit: number = 100,
  forceRefresh: boolean = false
): Promise<FetchContractsResult> {
  // 1. Try internal backend server API first
  try {
    const url = `/api/secop/contracts?limit=${limit}&refresh=${forceRefresh}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // If endpoint exists and responded with OK
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.contracts) && data.contracts.length > 0) {
        return {
          contracts: data.contracts,
          isLiveSource: !!data.isLiveSource,
          sourceMode: 'backend-api'
        };
      }
    }

    // If 404, we are likely on Vercel static or server is restarting
    if (res.status === 404) {
      console.warn('Endpoint /api/secop/contracts devolvió 404 (típico en Vercel estático sin Serverless Function). Activando ingesta directa desde cliente.');
    }
  } catch (backendErr) {
    console.warn('Backend API no disponible, activando modo directo:', (backendErr as Error).message);
  }

  // 2. Direct client-side fetch to datos.gov.co (Socrata Open Data API)
  // Socrata open data API has full CORS support (Access-Control-Allow-Origin: *)
  try {
    const socrataUrl = `https://www.datos.gov.co/resource/p6dx-8zbt.json?$limit=${Math.min(limit, 500)}&$order=fecha_de_firma%20DESC`;
    const clientRes = await fetch(socrataUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (clientRes.ok) {
      const rawData = await clientRes.json();
      if (Array.isArray(rawData) && rawData.length > 0) {
        const enriched = enrichContractsWithScores(rawData);
        return {
          contracts: enriched,
          isLiveSource: true,
          sourceMode: 'client-direct',
          message: 'Conexión directa del navegador a datos.gov.co (SECOP II en vivo vía cliente).'
        };
      }
    }
  } catch (clientErr) {
    console.warn('No se pudo consultar datos.gov.co directamente desde el navegador:', (clientErr as Error).message);
  }

  // 3. Fallback to enriched benchmark dataset
  const fallbackEnriched = enrichContractsWithScores(FALLBACK_SECOP_CONTRACTS);
  return {
    contracts: fallbackEnriched,
    isLiveSource: false,
    sourceMode: 'fallback-cache',
    message: 'Operando con dataset benchmark de contingencia (SECOP II offline o limitado).'
  };
}
