export function formatNumber(
  value: number | string,
  locale: string = "en-US"
): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) {
    return value.toString();
  }

  return new Intl.NumberFormat(locale).format(numberValue);
}
