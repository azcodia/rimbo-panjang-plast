import Delivery from "@/models/Delivery";
import HistoryTransaction from "@/models/History-Transaction";
import Payment from "@/models/Payment";
import ReStock from "@/models/Re-Stock";

export const getInventorySummary = async () => {
  const historyResult = await HistoryTransaction.aggregate([
    { $match: { deleted: { $ne: true } } },
    {
      $facet: {
        stock: [
          {
            $group: {
              _id: "$type",
              total: { $sum: "$quantity" },
            },
          },
        ],
        delivery: [
          { $match: { type: "out" } },
          {
            $group: {
              _id: null,
              total_qty: { $sum: "$quantity" },
              total_transactions: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const reStockResult = await ReStock.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        total_qty: { $sum: "$items.quantity" },
        total_transactions: { $sum: 1 },
      },
    },
  ]);

  const restock = reStockResult[0] || { total_qty: 0, total_transactions: 0 };
  const delivery = historyResult[0].delivery[0] || {
    total_qty: 0,
    total_transactions: 0,
  };

  const salesResult = await Payment.aggregate([
    {
      $match: {
        status: { $in: ["paid", "partially_paid"] },
      },
    },
    {
      $group: {
        _id: null,
        total_amount: { $sum: "$amount" },
        total_transactions: { $sum: 1 },
      },
    },
  ]);

  const sales = salesResult[0] || {
    total_amount: 0,
    total_transactions: 0,
  };

  const deliveryTotals = await Delivery.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$_id",
        delivery_total: { $sum: "$items.total_price" },
      },
    },
  ]);

  const paymentByDelivery = await Payment.aggregate([
    {
      $match: {
        status: { $in: ["paid", "partially_paid"] },
      },
    },
    {
      $group: {
        _id: "$delivery_id",
        paid_total: { $sum: "$amount" },
      },
    },
  ]);

  const paymentMap = new Map<string, number>();
  for (const p of paymentByDelivery) {
    paymentMap.set(p._id.toString(), p.paid_total);
  }

  let total_receivable = 0;
  let unpaid_deliveries = 0;

  for (const d of deliveryTotals) {
    const paid = paymentMap.get(d._id.toString()) || 0;
    const remaining = d.delivery_total - paid;

    if (remaining > 0) {
      total_receivable += remaining;
      unpaid_deliveries += 1;
    }
  }

  return {
    restock,
    delivery,
    sales,
    receivable: {
      total: total_receivable,
      unpaid_deliveries,
    },
  };
};
