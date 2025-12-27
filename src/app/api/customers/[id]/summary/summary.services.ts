import mongoose from "mongoose";
import Customer from "@/models/Customer";
import Delivery from "@/models/Delivery";
import Payment from "@/models/Payment";
import HistoryTransaction from "@/models/History-Transaction";

export const getCustomerSummary = async (customerId: string) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customerId");
  }
  const customerObjectId = new mongoose.Types.ObjectId(customerId);

  const customer = await Customer.findById(customerObjectId).lean();
  if (!customer) {
    throw new Error("Customer not found");
  }

  const deliveryTotals = await Delivery.aggregate([
    { $match: { customer_id: customerObjectId } },
    { $unwind: "$items" },
    { $group: { _id: "$_id", delivery_total: { $sum: "$items.total_price" } } },
  ]);

  const totalTagihan = deliveryTotals.reduce(
    (sum, d) => sum + (d.delivery_total || 0),
    0
  );

  const payments = await Payment.aggregate([
    {
      $lookup: {
        from: "deliveries",
        localField: "delivery_id",
        foreignField: "_id",
        as: "delivery",
      },
    },
    { $unwind: "$delivery" },
    {
      $match: {
        "delivery.customer_id": customerObjectId,
        status: "paid",
      },
    },
    { $group: { _id: null, total_paid: { $sum: "$amount" } } },
  ]);
  const totalDibayar = payments[0]?.total_paid || 0;

  const paymentByDelivery = await Payment.aggregate([
    {
      $lookup: {
        from: "deliveries",
        localField: "delivery_id",
        foreignField: "_id",
        as: "delivery",
      },
    },
    { $unwind: "$delivery" },
    {
      $match: {
        "delivery.customer_id": customerObjectId,
        status: "paid",
      },
    },
    { $group: { _id: "$delivery_id", paid_total: { $sum: "$amount" } } },
  ]);

  const paymentMap = new Map<string, number>();
  for (const p of paymentByDelivery) {
    paymentMap.set(p._id.toString(), p.paid_total);
  }

  let sisaPiutang = 0;
  let totalInvoicePending = 0;

  for (const d of deliveryTotals) {
    const paid = paymentMap.get(d._id.toString()) || 0;
    const remaining = d.delivery_total - paid;
    if (remaining > 0) {
      sisaPiutang += remaining;
      totalInvoicePending += 1;
    }
  }

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
        total_qty: { $sum: "$quantity" },
        total_weight: { $sum: { $multiply: ["$quantity", "$heavy.weight"] } },
      },
    },
  ]);
  const totalQuantity = historyAgg[0]?.total_qty || 0;
  const totalWeight = historyAgg[0]?.total_weight || 0;

  const lastTransaction = await Delivery.findOne({
    customer_id: customerObjectId,
  })
    .sort({ input_date: -1 })
    .select("input_date")
    .lean();

  const avgDiscountAgg = await Delivery.aggregate([
    { $match: { customer_id: customerObjectId } },
    { $unwind: "$items" },
    {
      $match: {
        "items.unit_price": { $gt: 0 },
        "items.discount_per_item": { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        avg_discount: {
          $avg: {
            $multiply: [
              { $divide: ["$items.discount_per_item", "$items.unit_price"] },
              100,
            ],
          },
        },
      },
    },
  ]);

  const avgDiscountPercent = avgDiscountAgg[0]?.avg_discount || 0;

  return {
    customer,
    finance: {
      total_tagihan: totalTagihan,
      total_dibayar: totalDibayar,
      sisa_piutang: sisaPiutang,
      total_invoice_pending: totalInvoicePending,
    },
    totals: {
      quantity: totalQuantity,
      weight: totalWeight,
      payment: totalDibayar,
    },
    insights: {
      last_transaction_date: lastTransaction?.input_date || null,
      avg_discount_percent: Number(avgDiscountPercent.toFixed(2)),
    },
  };
};
