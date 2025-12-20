import Stock from "@/models/Stock";

export const getCurrentStock = async (
  query: any,
  skip: number,
  limit: number
) => {
  const total = await Stock.countDocuments(query);

  const data = await Stock.find(query)
    .populate("color_id", "color")
    .populate("size_id", "size")
    .populate("heavy_id", "weight")
    .skip(skip)
    .limit(limit)
    .sort({ quantity: -1 });

  const filteredData = data.filter(
    (s) => s.color_id && s.size_id && s.heavy_id
  );

  const mappedData = filteredData.map((s) => ({
    id: s._id,
    color_id: s.color_id?._id ?? null,
    color: s.color_id?.color ?? "",
    size_id: s.size_id?._id ?? null,
    size: s.size_id?.size ?? "",
    heavy_id: s.heavy_id?._id ?? null,
    heavy: s.heavy_id?.weight ?? "",
    quantity: s.quantity,
    input_date: s.input_date,
    tokenHistory: s.tokenHistory,
    created_at: s.created_at,
  }));

  return { total, data: mappedData };
};
