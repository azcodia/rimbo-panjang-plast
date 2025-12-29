import mongoose from "mongoose";
import HistoryTransaction from "@/models/History-Transaction";
import Delivery from "@/models/Delivery";

export const getCustomerPurchaseSummary = async (customerId: string) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customerId");
  }

  const customerObjectId = new mongoose.Types.ObjectId(customerId);

  const totalTransactions = await Delivery.countDocuments({
    customer_id: customerObjectId,
  });

  const historyAgg = await HistoryTransaction.aggregate([
    {
      $match: {
        customer_id: customerObjectId,
        type: "out",
        deleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "heavies",
        localField: "heavy_id",
        foreignField: "_id",
        as: "heavy",
      },
    },
    { $unwind: "$heavy" },
    {
      $group: {
        _id: null,
        total_quantity: { $sum: "$quantity" },
        total_weight: {
          $sum: { $multiply: ["$quantity", "$heavy.weight"] },
        },
      },
    },
  ]);

  const totalQuantity = historyAgg[0]?.total_quantity || 0;
  const totalWeight = historyAgg[0]?.total_weight || 0;

  const deliveryTotals = await Delivery.aggregate([
    { $match: { customer_id: customerObjectId } },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        total_amount: { $sum: "$items.total_price" },
      },
    },
  ]);

  const totalAmount = deliveryTotals[0]?.total_amount || 0;

  return {
    total_transactions: totalTransactions,
    total_quantity: totalQuantity,
    total_weight: totalWeight,
    total_amount: totalAmount,
  };
};
