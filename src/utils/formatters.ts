export function formatCOP(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '$0 COP';
  const num = Number(amount);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(num);
}

export function formatCompactCOP(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '$0';
  const num = Number(amount);
  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)} Billones`;
  }
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)} Mil M`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)} M`;
  }
  return formatCOP(num);
}

export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function getRiskColor(level: string | undefined): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (level) {
    case 'Crítico':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-300',
        badge: 'bg-rose-100 text-rose-800 border-rose-200'
      };
    case 'Alto':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-300',
        badge: 'bg-amber-100 text-amber-800 border-amber-200'
      };
    case 'Medio':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-300',
        badge: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      };
  }
}
