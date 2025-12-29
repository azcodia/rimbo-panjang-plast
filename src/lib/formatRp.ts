type FormatType = "short" | "full";

interface FormatRpOptions {
  format?: FormatType;
  withSymbol?: boolean;
}

export function formatRp(
  value: number | string,
  options: FormatRpOptions = {}
): string {
  const { format = "full", withSymbol = true } = options;
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return value.toString();

  if (format === "full") {
    const formatted = new Intl.NumberFormat("id-ID").format(numberValue);
    return withSymbol ? `Rp.${formatted}` : formatted;
  }

  const shorten = (num: number, div: number, suffix: string) => {
    const result = Math.floor((num / div) * 10) / 10;
    return result % 1 === 0
      ? `${result.toFixed(0)}${suffix}`
      : `${result}${suffix}`;
  };

  let formatted = "";

  if (numberValue >= 1_000_000_000) {
    formatted = shorten(numberValue, 1_000_000_000, "M");
  } else if (numberValue >= 1_000_000) {
    formatted = shorten(numberValue, 1_000_000, "Jt");
  } else if (numberValue >= 1_000) {
    formatted = shorten(numberValue, 1_000, "Rb");
  } else {
    formatted = numberValue.toString();
  }

  return withSymbol ? `Rp.${formatted}` : formatted;
}
