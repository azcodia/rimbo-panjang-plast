import Stock from "@/models/Stock";

export const getStocks = async (query: any, skip: number, limit: number) => {
  // query bisa punya color_id, size_id, heavy_id
  const mongoQuery: any = {};

  if (query.color_id) mongoQuery.color_id = query.color_id;
  if (query.size_id) mongoQuery.size_id = query.size_id;
  if (query.heavy_id) mongoQuery.heavy_id = query.heavy_id;

  const total = await Stock.countDocuments(mongoQuery);

  const data = await Stock.find(mongoQuery)
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
    tokenHistory: s.tokenHistory,
    created_at: s.created_at,
  }));

  return { total, data: mappedData };
};

export const createStock = async (
  color_id: string,
  size_id: string,
  heavy_id: string,
  quantity: number,
  input_date?: Date,
  tokenHistory?: string
) => {
  const exists = await Stock.findOne({ color_id, size_id, heavy_id });
  if (exists) throw new Error("Stock already exists");

  return Stock.create({
    color_id,
    size_id,
    heavy_id,
    quantity,
    input_date,
    tokenHistory,
  });
};

export const updateStock = async (
  id: string,
  color_id: string,
  size_id: string,
  heavy_id: string,
  quantity: number,
  input_date?: Date,
  tokenHistory?: string
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
      tokenHistory,
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

export const updateStockQuantity = async (
  stockId: string,
  quantityChange: number
) => {
  const stock = await Stock.findById(stockId);
  if (!stock) throw new Error("Stock not found");

  const change = Number(quantityChange);
  if (isNaN(change)) throw new Error("Invalid quantityChange");

  stock.quantity = Number(stock.quantity || 0) + change;

  if (stock.quantity < 0) stock.quantity = 0;

  stock.updated_at = new Date();
  await stock.save();

  return stock;
};
