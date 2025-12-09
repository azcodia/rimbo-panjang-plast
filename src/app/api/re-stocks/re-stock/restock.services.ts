import { toObjectId } from "@/lib/mongo";
import ReStock from "@/models/Re-Stock";

interface ReStockInput {
  code: string;
  user_id: string;
  note?: string;
  description?: string;
  items: {
    stock_id: string;
    color_id: string;
    size_id: string;
    heavy_id: string;
    quantity: number;
  }[];
}

export const getReStocks = async (query: any, skip: number, limit: number) => {
  const total = await ReStock.countDocuments(query);

  const data = await ReStock.find(query)
    .populate("user_id", "name email")
    .populate("items.stock_id")
    .populate("items.color_id")
    .populate("items.size_id")
    .populate("items.heavy_id")
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  return { total, data };
};

export const createReStock = async (data: ReStockInput) => {
  const exists = await ReStock.findOne({ code: data.code });
  if (exists) throw new Error("ReStock code already exists");

  const items = data.items.map((i) => ({
    stock_id: toObjectId(i.stock_id),
    color_id: toObjectId(i.color_id),
    size_id: toObjectId(i.size_id),
    heavy_id: toObjectId(i.heavy_id),
    quantity: i.quantity,
  }));

  return ReStock.create({
    code: data.code,
    user_id: toObjectId(data.user_id),
    note: data.note,
    description: data.description,
    items,
  });
};

export const updateReStock = async (id: string, data: ReStockInput) => {
  const items = data.items.map((i) => ({
    stock_id: toObjectId(i.stock_id),
    color_id: toObjectId(i.color_id),
    size_id: toObjectId(i.size_id),
    heavy_id: toObjectId(i.heavy_id),
    quantity: i.quantity,
  }));

  return ReStock.findByIdAndUpdate(
    id,
    {
      code: data.code,
      user_id: toObjectId(data.user_id),
      note: data.note,
      description: data.description,
      items,
    },
    { new: true }
  )
    .populate("user_id")
    .populate("items.stock_id")
    .populate("items.color_id")
    .populate("items.size_id")
    .populate("items.heavy_id");
};

export const deleteReStock = async (id: string) => {
  return ReStock.findByIdAndDelete(id);
};
