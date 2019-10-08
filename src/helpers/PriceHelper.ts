export const formatMoney = (value: number | null | undefined, decimal: number = 0) =>
  Intl.NumberFormat('en-EN', {
    currency: 'USD',
    style: 'currency',
    maximumFractionDigits: decimal,
    minimumFractionDigits: decimal,
  }).format(value || 0)
