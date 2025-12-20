import { TableRow } from "@/components/table/Table";
import { formatNumber } from "./formatNumber";

export function groupAndSortStock<
  T extends { color_id: string; color?: string; size: string | number }
>(data: T[]) {
  const map = new Map<string, T[]>();

  data.forEach((item) => {
    if (!map.has(item.color_id)) map.set(item.color_id, []);
    map.get(item.color_id)?.push(item);
  });

  const grouped: TableRow<T>[] = [];

  map.forEach((items) => {
    items.sort((a, b) => {
      const sizeA = typeof a.size === "string" ? parseFloat(a.size) : a.size;
      const sizeB = typeof b.size === "string" ? parseFloat(b.size) : b.size;
      return sizeA - sizeB;
    });

    items.forEach((item, index) => {
      grouped.push({
        data: {
          ...item,
          color: index === 0 ? item.color || "" : "",
        },
      });
    });
  });

  return grouped;
}

export function formatStockQuantity(quantity: number) {
  return formatNumber(quantity);
}
