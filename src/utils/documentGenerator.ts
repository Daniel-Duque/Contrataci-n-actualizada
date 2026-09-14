import { ContractDocument, SecopContract } from '../types';

export function generateDocumentsForContract(contract: Partial<SecopContract> | any): ContractDocument[] {
  const ref = contract?.referencia_del_contrato || contract?.id_contrato || 'CTO-SECOP-2024';
  const entidad = contract?.nombre_entidad || 'Entidad Pública Estatal';
  const valor = Number(contract?.valor_del_contrato) || Number(contract?.cuant_a_a_contratar) || 1200000000;
  const adiciones = Number(contract?.valor_total_adiciones) || Math.round(valor * 0.35);
  const contratista = contract?.nom_raz_social_contratista || 'Consorcio Adjudicatario SECOP';
  const objeto = contract?.objeto_del_contrato || 'Ejecución integral del objeto contractual según pliego de condiciones';
  const cleanRef = String(ref).replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedRef = String(ref);

  return [
    {
      id: `${sanitizedRef}-DOC-01`,
      contractRef: sanitizedRef,
      title: 'Estudios Previos de Necesidad y Conveniencia',
      category: 'Estudios Previos',
      filename: `Estudios_Previos_${cleanRef}.pdf`,
      fileSize: '4.2 MB',
      pages: 48,
      downloadUrl: `/api/scraper/download/${encodeURIComponent(sanitizedRef)}/Estudios_Previos.pdf`,
      hashSha256: '9f83c1b82a7f34081c2e4091abcf59e81b6c72834d82f912e87311a2f4c51920',
      dateUploaded: '2024-01-15',
      extractedTextSample: `REPUBLICA DE COLOMBIA - ${entidad}
DOCUMENTO DE ESTUDIOS PREVIOS Y ANÁLISIS DEL SECTOR (Art. 2.2.1.1.2.1.1 Decreto 1082 de 2015).
1. JUSTIFICACIÓN DE LA NECESIDAD: La entidad requiere contratar: "${objeto}".
2. ESTIMACIÓN Y ANÁLISIS DE PRECIOS: Se tomaron como referencia cotizaciones comerciales y precios históricos del sector. El presupuesto estimado oficial asciende a $${valor.toLocaleString('es-CO')} COP.
3. RIESGOS IDENTIFICADOS: Riesgo geológico/operativo, fluctuación de precios de insumos en el mercado, disponibilidad de personal técnico calificado.
4. FORMA DE PAGO: Anticipo del 20% y actas parciales mensuales contra entrega de informes de interventoría y supervisión.`,
      isStoredInDataLake: true,
      dataLakeUri: `hf://datasets/transparencia-colombia/secop-lake/${sanitizedRef}/Estudios_Previos.pdf`
    },
    {
      id: `${sanitizedRef}-DOC-02`,
      contractRef: sanitizedRef,
      title: 'Pliego de Condiciones Definitivo',
      category: 'Pliego de Condiciones',
      filename: `Pliego_Condiciones_${cleanRef}.pdf`,
      fileSize: '7.8 MB',
      pages: 94,
      downloadUrl: `/api/scraper/download/${encodeURIComponent(sanitizedRef)}/Pliego_Condiciones.pdf`,
      hashSha256: 'a14b98c392f9810a9f029e84b8219c40294821a89f41283c10a498b21c9041fa',
      dateUploaded: '2024-02-01',
      extractedTextSample: `PLIEGO DE CONDICIONES DEFINITIVO - CONTRATACIÓN PÚBLICA
PROCESO DE CONTRATACIÓN: ${sanitizedRef}
Capítulo III - Criterios de Evaluación y Calificación de Ofertas:
- Capacidad Jurídica: Requisito Habilitante (Cumple/No Cumple)
- Capacidad Financiera: Índice de Liquidez >= 1.5, Nivel de Endeudamiento <= 70%
- Oferta Económica: 60 puntos evaluados mediante fórmula de media geométrica con presupuesto de $${valor.toLocaleString('es-CO')} COP.
- Factor de Apoyo a la Industria Nacional: 20 puntos.
- Criterios Ambientales y Sostenibles: 20 puntos.
Capítulo IV - Asignación de Riesgos Previsibles de acuerdo a la matriz Colombia Compra Eficiente.`,
      isStoredInDataLake: true,
      dataLakeUri: `hf://datasets/transparencia-colombia/secop-lake/${sanitizedRef}/Pliego_Condiciones.pdf`
    },
    {
      id: `${sanitizedRef}-DOC-03`,
      contractRef: sanitizedRef,
      title: 'Contrato Principal Suscrito',
      category: 'Contrato Principal',
      filename: `Minuta_Contrato_${cleanRef}.pdf`,
      fileSize: '3.1 MB',
      pages: 26,
      downloadUrl: `/api/scraper/download/${encodeURIComponent(sanitizedRef)}/Minuta_Contrato.pdf`,
      hashSha256: 'b45c9281a89f0291e847c10294819bcf849201948bc894210a498c2198421094',
      dateUploaded: '2024-02-28',
      extractedTextSample: `MINUTA DE CONTRATO ESTATAL No. ${sanitizedRef}
Entre los suscritos, el Ordenador del Gasto de ${entidad} y por la otra parte el Representante Legal de ${contratista}.
CLÁUSULA PRIMERA - OBJETO: El contratista se obliga a ejecutar: ${objeto}.
CLÁUSULA SEGUNDA - VALOR DEL CONTRATO: La cuantía fija pactada es la suma de $${valor.toLocaleString('es-CO')} COP.
CLÁUSULA TERCERA - PLAZO DE EJECUCIÓN: El término de ejecución será el establecido en el cronograma oficial.
CLÁUSULA DÉCIMA - MULTAS Y SANCIONES: En caso de mora o incumplimiento parcial, la entidad impondrá multas del 0.5% del valor por cada día de retardo sin exceder el 10% del valor total.
CLÁUSULA DÉCIMA QUINTA - SUPERVISIÓN: La vigilancia y control técnico será ejercida por interventoría externa designada por la entidad.`,
      isStoredInDataLake: true,
      dataLakeUri: `hf://datasets/transparencia-colombia/secop-lake/${sanitizedRef}/Minuta_Contrato.pdf`
    },
    {
      id: `${sanitizedRef}-DOC-04`,
      contractRef: sanitizedRef,
      title: 'Propuesta Económica y Desglose de Precios Unitarios',
      category: 'Propuesta Económica',
      filename: `Propuesta_Economica_${cleanRef}.pdf`,
      fileSize: '2.5 MB',
      pages: 18,
      downloadUrl: `/api/scraper/download/${encodeURIComponent(sanitizedRef)}/Propuesta_Economica.pdf`,
      hashSha256: 'c89148b8192a0481bc92049184abcf92819401829bc819201849102948192049',
      dateUploaded: '2024-02-14',
      extractedTextSample: `PROPUESTA ECONÓMICA PRESENTADA POR: ${contratista}
CUADRO DE PRECIOS UNITARIOS Y A.I.U. (Administración 15%, Imprevistos 5%, Utilidad 8%).
- Valor total ofertado antes de IVA: $${Math.round(valor * 0.84).toLocaleString('es-CO')} COP.
- IVA sobre la Utilidad (19%): $${Math.round(valor * 0.16).toLocaleString('es-CO')} COP.
- VALOR TOTAL DE LA OFERTA ECONÓMICA: $${valor.toLocaleString('es-CO')} COP.
Declaración bajo gravedad de juramento de no encontrarse incurso en inhabilidades ni incompatibilidades constitucionales ni legales (Ley 80 de 1993).`,
      isStoredInDataLake: false
    },
    {
      id: `${sanitizedRef}-DOC-05`,
      contractRef: sanitizedRef,
      title: 'Otrosí / Modificatorio y Adición Presupuestal No. 1',
      category: 'Adición / Modificatorio',
      filename: `Otrosi_Modificatorio_${cleanRef}.pdf`,
      fileSize: '1.9 MB',
      pages: 12,
      downloadUrl: `/api/scraper/download/${encodeURIComponent(sanitizedRef)}/Otrosi_Modificatorio.pdf`,
      hashSha256: 'd9201948bc894210a498c2198421094b45c9281a89f0291e847c10294819bcf8',
      dateUploaded: '2024-07-20',
      extractedTextSample: `DOCUMENTO MODIFICATORIO Y ADICIÓN EN VALOR Y TIEMPO No. 1 AL CONTRATO ${sanitizedRef}.
JUSTIFICACIÓN DE LA SUPERVISIÓN TÉCNICA: Debido a imprevistos en terreno y requerimiento de mayores cantidades no previstas en los estudios iniciales, se hace indispensable adicionar el contrato.
- VALOR DE LA ADICIÓN: $${adiciones.toLocaleString('es-CO')} COP (Equivalente al ${valor > 0 ? ((adiciones / valor) * 100).toFixed(1) : '0'}% del contrato inicial).
- NUEVO VALOR TOTAL CONSOLIDADO: $${(valor + adiciones).toLocaleString('es-CO')} COP.
- PRÓRROGA: Se amplía el plazo de ejecución en 90 días calendario adicionales.
- JUSTIFICACIÓN DE SOBRECOSTO: Se anexan actas de mayores cantidades aprobadas por el interventor y ordenador del gasto.`,
      isStoredInDataLake: true,
      dataLakeUri: `hf://datasets/transparencia-colombia/secop-lake/${sanitizedRef}/Otrosi_Modificatorio.pdf`
    },
    {
      id: `${sanitizedRef}-DOC-06`,
      contractRef: sanitizedRef,
      title: 'Informe Mensual de Supervisión e Interventoría',
      category: 'Informe de Supervisión',
      filename: `Informe_Supervision_${cleanRef}.pdf`,
      fileSize: '5.4 MB',
      pages: 35,
      downloadUrl: `/api/scraper/download/${encodeURIComponent(sanitizedRef)}/Informe_Supervision.pdf`,
      hashSha256: 'e10294819bcf849201948bc894210a498c2198421094b45c9281a89f0291e847',
      dateUploaded: '2024-08-30',
      extractedTextSample: `INFORME PERIODICO DE SUPERVISIÓN No. 04 - ESTADO DEL CONTRATO ${sanitizedRef}
ESTADO DE EJECUCIÓN FÍSICA Y FINANCIERA:
- Avance Físico Programado según cronograma: 65%
- Avance Físico Real Ejecutado en terreno: 48% (Retraso crítico de 17% respecto al cronograma contractual)
- Desembolsos Acumulados girados al contratista: $${Math.round((valor + adiciones) * 0.55).toLocaleString('es-CO')} COP.
OBSERVACIONES Y ALERTAS DEL SUPERVISOR: Se evidencia demora reiterada en la entrega de suministros en sitio y escasez de cuadrillas de trabajo. Se requirió al contratista mediante memorando conminatorio para presentar plan de contingencia inmediato so pena de iniciar trámite de aplicación de multas por mora.`,
      isStoredInDataLake: true,
      dataLakeUri: `hf://datasets/transparencia-colombia/secop-lake/${sanitizedRef}/Informe_Supervision.pdf`
    }
  ];
}
