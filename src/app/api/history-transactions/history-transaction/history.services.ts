import HistoryTransactionModel from "@/models/History-Transaction";
import { toObjectId } from "@/lib/mongo";

export const createHistoryTransaction = async (data: {
  stock_id: string;
  color_id: string;
  size_id: string;
  heavy_id: string;
  type: string;
  quantity: number;
  note: string;
  description?: string;
  user_id: string;
  input_date?: Date;
}) => {
  return HistoryTransactionModel.create({
    stock_id: toObjectId(data.stock_id),
    color_id: toObjectId(data.color_id),
    size_id: toObjectId(data.size_id),
    heavy_id: toObjectId(data.heavy_id),
    type: data.type,
    quantity: data.quantity,
    note: data.note,
    description: data.description,
    user_id: toObjectId(data.user_id),
    input_date: data.input_date ? new Date(data.input_date) : new Date(),
  });
};

export const updateHistoryTransaction = async (
  id: string,
  data: Partial<{
    stock_id: string;
    color_id: string;
    size_id: string;
    heavy_id: string;
    type: string;
    quantity: number;
    note: string;
    description?: string;
    user_id: string;
    input_date?: Date;
  }>
) => {
  const updateData: any = { ...data };
  if (data.stock_id) updateData.stock_id = toObjectId(data.stock_id);
  if (data.color_id) updateData.color_id = toObjectId(data.color_id);
  if (data.size_id) updateData.size_id = toObjectId(data.size_id);
  if (data.heavy_id) updateData.heavy_id = toObjectId(data.heavy_id);
  if (data.user_id) updateData.user_id = toObjectId(data.user_id);
  if (data.input_date) updateData.input_date = new Date(data.input_date);
  updateData.created_at = new Date();

  return HistoryTransactionModel.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("color_id")
    .populate("size_id")
    .populate("heavy_id")
    .populate("user_id");
};

export const softDeleteHistoryTransaction = async (stock_id: string) => {
  return HistoryTransactionModel.updateMany(
    { stock_id },
    { $set: { deleted: true } }
  );
};

export const getHistoryTransactions = async (
  query: any,
  skip: number,
  limit: number
) => {
  const total = await HistoryTransactionModel.countDocuments(query);
  const data = await HistoryTransactionModel.find(query)
    .populate("color_id")
    .populate("size_id")
    .populate("heavy_id")
    .populate("user_id")
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  return { total, data };
};
