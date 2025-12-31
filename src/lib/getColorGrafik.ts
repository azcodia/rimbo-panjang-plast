export function getColorGrafik(index: number) {
  const colors = ["#2098d5", "#7bb927", "#e81417"];
  return colors[index % colors.length];
}
