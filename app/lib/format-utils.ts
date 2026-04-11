export function formatCurrency(amount: number, divisor: number): string {
  return (amount / divisor).toFixed(2)
}
