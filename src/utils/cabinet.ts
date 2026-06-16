export function calcProjectedArea(width: number | null | undefined, height: number | null | undefined): number {
  if (!width || !height) return 0;
  return (width / 1000) * (height / 1000);
}

export function calcEstimatedPrice(area: number, unitPrice: number | null | undefined): number {
  if (!area || !unitPrice) return 0;
  return Math.round(area * unitPrice);
}
