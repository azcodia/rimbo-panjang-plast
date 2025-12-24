import HistoryTransaction from "@/models/History-Transaction";
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
        sales: [
          { $match: { type: "out", total_price: { $exists: true } } },
          {
            $group: {
              _id: null,
              total_amount: { $sum: "$total_price" },
              total_transactions: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const stockData = historyResult[0].stock || [];
  let stockIn = 0;
  let stockOut = 0;
  let stockAdjust = 0;
  for (const s of stockData) {
    if (s._id === "in") stockIn = s.total;
    if (s._id === "out") stockOut = s.total;
    if (s._id === "adjust") stockAdjust = s.total;
  }
  const totalStock = stockIn - stockOut + stockAdjust;

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
  const sales = historyResult[0].sales[0] || { total_amount: 0 };

  return {
    total_stock: totalStock,
    restock,
    delivery,
    sales,
  };
};
