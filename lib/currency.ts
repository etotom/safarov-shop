// Currency conversion rates (updated periodically)
// In production, use a real API like exchangerate-api.com or fixer.io
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.87,
  CNY: 7.24,
}

export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount
  
  const fromRate = exchangeRates[from.toUpperCase()] || 1
  const toRate = exchangeRates[to.toUpperCase()] || 1
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  return usdAmount * toRate
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

export function getAvailableCurrencies(): string[] {
  return Object.keys(exchangeRates)
}

export function getExchangeRate(from: string, to: string): number {
  if (from === to) return 1
  const fromRate = exchangeRates[from.toUpperCase()] || 1
  const toRate = exchangeRates[to.toUpperCase()] || 1
  return toRate / fromRate
}
