/**
 * Format numbers with "k" for thousands
 * Examples: 0 -> "0.00", 1000 -> "1k", 2500 -> "2.5k", 1500000 -> "1.5M"
 */
export function formatCurrency(value: number, showDecimals: boolean = false): string {
  if (value === 0) {
    return "0.00";
  }

  if (value < 1000) {
    return showDecimals ? value.toFixed(2) : value.toString();
  }

  if (value < 1000000) {
    const formatted = value / 1000;
    return formatted % 1 === 0 ? `${formatted}k` : `${formatted.toFixed(1)}k`;
  }

  if (value < 1000000000) {
    const formatted = value / 1000000;
    return formatted % 1 === 0 ? `${formatted}M` : `${formatted.toFixed(1)}M`;
  }

  const formatted = value / 1000000000;
  return formatted % 1 === 0 ? `${formatted}B` : `${formatted.toFixed(1)}B`;
}

/**
 * Format numbers for display with Nigerian Naira symbol
 */
export function formatNaira(value: number, useShortFormat: boolean = false): string {
  if (useShortFormat) {
    return `₦${formatCurrency(value)}`;
  }
  
  return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(value: string): number {
  const cleanValue = value.replace(/[₦,k]/g, '');
  const multiplier = value.toLowerCase().includes('k') ? 1000 : 
                    value.toLowerCase().includes('m') ? 1000000 : 
                    value.toLowerCase().includes('b') ? 1000000000 : 1;
  return parseFloat(cleanValue) * multiplier;
} 