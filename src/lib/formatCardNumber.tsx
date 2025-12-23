export const formatRekening = (input: number | string): string => {
  const digits = String(input).replace(/\D/g, "");

  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.substr(i, 4));
  }

  return groups.join(" ");
};
