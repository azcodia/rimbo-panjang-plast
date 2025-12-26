export function formatWeight(totalQty: number, weightPerItem: number | string) {
  const weight = Number(weightPerItem) * totalQty;
  const weightInKg = weight / 1000;

  if (weightInKg >= 1_000_000_000) {
    const weightInGt = weightInKg / 1_000_000_000;
    return `${weightInGt.toFixed(2).replace(".", ",")} giga ton`;
  } else if (weightInKg >= 1_000_000) {
    const weightInMt = weightInKg / 1_000_000;
    return `${weightInMt.toFixed(2).replace(".", ",")} mega ton`;
  } else if (weightInKg >= 1000) {
    const weightInTon = weightInKg / 1000;
    return `${weightInTon.toFixed(2).replace(".", ",")} ton`;
  } else {
    return `${weightInKg.toFixed(2).replace(".", ",")} kg`;
  }
}
