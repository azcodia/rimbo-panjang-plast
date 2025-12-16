export function formatRp(
  value: number | string,
  withSymbol: boolean = true
): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) {
    return value.toString();
  }

  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numberValue);

  return withSymbol ? `Rp.${formatted}` : formatted;
}
