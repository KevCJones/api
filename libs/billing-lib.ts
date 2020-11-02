export function calculateCost(amount: number): number {
  if (amount <= 100) return amount * 100;
  if (amount <= 1000) return amount * 80;
  else return amount * 50;
}
