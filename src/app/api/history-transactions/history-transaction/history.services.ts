// import HistoryTransactionModel from "@/models/History-Transaction";
// import { toObjectId } from "@/lib/mongo";

// export const createHistoryTransaction = async (data: {
//   stock_id: string;
//   color_id: string;
//   size_id: string;
//   heavy_id: string;
//   type: string;
//   quantity: number;
//   note: string;
//   description?: string;
//   user_id: string;
//   input_date?: Date;
//   tokenHistory: string;
// }) => {
//   return HistoryTransactionModel.create({
//     stock_id: toObjectId(data.stock_id),
//     color_id: toObjectId(data.color_id),
//     size_id: toObjectId(data.size_id),
//     heavy_id: toObjectId(data.heavy_id),
//     type: data.type,
//     quantity: data.quantity,
//     note: data.note,
//     description: data.description,
//     user_id: toObjectId(data.user_id),
//     input_date: data.input_date ? new Date(data.input_date) : new Date(),
//     tokenHistory: data.tokenHistory,
//   });
// };

// export const updateHistoryTransactionByToken = async (
//   tokenHistory: string,
//   data: Partial<{
//     stock_id: string;
//     color_id: string;
//     size_id: string;
//     heavy_id: string;
//     type: string;
//     quantity: number;
//     note: string;
//     description?: string;
//     user_id: string;
//     input_date?: Date;
//   }>
// ) => {
//   const updateData: any = { ...data };
//   if (data.stock_id) updateData.stock_id = toObjectId(data.stock_id);
//   if (data.color_id) updateData.color_id = toObjectId(data.color_id);
//   if (data.size_id) updateData.size_id = toObjectId(data.size_id);
//   if (data.heavy_id) updateData.heavy_id = toObjectId(data.heavy_id);
//   if (data.user_id) updateData.user_id = toObjectId(data.user_id);
//   if (data.input_date) updateData.input_date = new Date(data.input_date);
//   updateData.created_at = new Date();

//   return HistoryTransactionModel.findOneAndUpdate(
//     { tokenHistory },
//     updateData,
//     { new: true }
//   )
//     .populate("color_id")
//     .populate("size_id")
//     .populate("heavy_id")
//     .populate("user_id");
// };

// export const softDeleteHistoryTransaction = async (
//   tokenHistory: string,
//   note?: string
// ) => {
//   note = note || "(Stock deleted by user)";

//   const docs = await HistoryTransactionModel.find({ tokenHistory });

//   const bulkOps = docs.map((doc) => {
//     const oldNote = typeof doc.note === "string" ? doc.note : "";
//     const newNote = oldNote ? `${oldNote}: ${note}` : note;

//     return {
//       updateOne: {
//         filter: { _id: doc._id },
//         update: { $set: { deleted: true, note: newNote } },
//       },
//     };
//   });

//   if (bulkOps.length === 0) return { modifiedCount: 0 };

//   const result = await HistoryTransactionModel.bulkWrite(bulkOps);
//   return result;
// };

// export const getHistoryTransactions = async (
//   query: any,
//   skip: number,
//   limit: number
// ) => {
//   const total = await HistoryTransactionModel.countDocuments(query);
//   const data = await HistoryTransactionModel.find(query)
//     .populate("color_id")
//     .populate("size_id")
//     .populate("heavy_id")
//     .populate("user_id")
//     .skip(skip)
//     .limit(limit)
//     .sort({ created_at: -1 });

//   return { total, data };
// };

import HistoryTransactionModel from "@/models/History-Transaction";
import { toObjectId } from "@/lib/mongo";

/**
 * CREATE
 */

export interface CreateHistoryTransactionData {
  stock_id: string;
  color_id: string;
  size_id: string;
  heavy_id: string;
  type: "in" | "out" | "adjust";
  quantity: number;

  unit_price?: number;
  discount_per_item?: number;
  total_price?: number;

  note: string;
  description?: string;
  user_id: string;
  input_date?: Date;
  tokenHistory: string;
}

export const createHistoryTransaction = async (
  data: CreateHistoryTransactionData
) => {
  const payload: any = {
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
    tokenHistory: data.tokenHistory,
    unit_price: data.unit_price ?? 0, // pastikan masuk
    discount_per_item: data.discount_per_item ?? 0, // pastikan masuk
    total_price: data.total_price ?? 0,
  };

  // Debug: cek payload sebelum save
  console.log("Payload to save in history transaction:", payload);

  return HistoryTransactionModel.create(payload);
};

/**
 * UPDATE BY TOKEN
 */
export const updateHistoryTransactionByToken = async (
  tokenHistory: string,
  data: Partial<{
    stock_id: string;
    color_id: string;
    size_id: string;
    heavy_id: string;
    type: string;
    quantity: number;
    unit_price?: number;
    discount_per_item?: number;
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

  if (data.type === "out" && data.unit_price != null && data.quantity != null) {
    const discountPerItem = data.discount_per_item ?? 0;

    updateData.unit_price = data.unit_price;
    updateData.discount_per_item = discountPerItem;
    updateData.total_price =
      (data.unit_price - discountPerItem) * data.quantity;
  }

  return HistoryTransactionModel.findOneAndUpdate(
    { tokenHistory },
    updateData,
    { new: true }
  )
    .populate("color_id")
    .populate("size_id")
    .populate("heavy_id")
    .populate("user_id");
};

/**
 * SOFT DELETE (BULK)
 */
export const softDeleteHistoryTransaction = async (
  tokenHistory: string,
  note?: string
) => {
  const docs = await HistoryTransactionModel.find({ tokenHistory });

  const bulkOps = docs.map((doc) => ({
    updateOne: {
      filter: { _id: doc._id },
      update: {
        $set: {
          deleted: true,
          note: note ? `${doc.note} : ${note}` : doc.note,
        },
      },
    },
  }));

  if (!bulkOps.length) return { modifiedCount: 0 };

  return HistoryTransactionModel.bulkWrite(bulkOps);
};

/**
 * GET LIST
 */
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
