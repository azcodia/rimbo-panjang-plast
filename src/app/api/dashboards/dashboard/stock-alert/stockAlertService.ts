import Stock from "@/models/Stock";

interface GetStockAlertParams {
  threshold?: number;
  inactiveDays?: number;
}

export const getStockAlert = async ({
  threshold = 10,
}: GetStockAlertParams) => {
  const lowStock = await Stock.find({
    deleted: { $ne: true },
    quantity: { $lte: threshold },
  })
    .populate("color_id", "color")
    .populate("size_id", "size")
    .populate("heavy_id", "weight")
    .select("_id name quantity unit color_id size_id heavy_id")
    .lean();

  const mapped = lowStock.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    stock: s.quantity,
    unit: s.unit,
    color: s.color_id ? (s.color_id as any).color : null,
    size: s.size_id ? (s.size_id as any).size : null,
    heavy: s.heavy_id ? (s.heavy_id as any).weight : null,
  }));

  // Sort by color ASC
  mapped.sort((a, b) => {
    if (!a.color) return 1;
    if (!b.color) return -1;
    return a.color.localeCompare(b.color);
  });

  return {
    lowStock: mapped,
  };
};
