import Stock from "@/models/Stock";

export const getStocks = async (query: any, skip: number, limit: number) => {
  const total = await Stock.countDocuments(query);

  const data = await Stock.find(query)
    .populate("color_id", "color")
    .populate("size_id", "size")
    .populate("heavy_id", "weight")
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

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
    created_at: s.created_at,
  }));

  return { total: total, data: mappedData };
};

export const createStock = async (
  color_id: string,
  size_id: string,
  heavy_id: string,
  quantity: number,
  input_date?: Date
) => {
  const exists = await Stock.findOne({ color_id, size_id, heavy_id });
  if (exists) throw new Error("Stock already exists");
  return Stock.create({ color_id, size_id, heavy_id, quantity, input_date });
};

export const updateStock = async (
  id: string,
  color_id: string,
  size_id: string,
  heavy_id: string,
  quantity: number,
  input_date?: Date
) => {
  const exists = await Stock.findOne({
    color_id,
    size_id,
    heavy_id,
    _id: { $ne: id },
  });
  if (exists) throw new Error("Stock combination already exists");
  return Stock.findByIdAndUpdate(
    id,
    {
      color_id,
      size_id,
      heavy_id,
      quantity,
      input_date,
      updated_at: new Date(),
    },
    { new: true }
  )
    .populate("color_id")
    .populate("size_id")
    .populate("heavy_id");
};

export const deleteStock = async (id: string) => {
  return Stock.findByIdAndDelete(id);
};
