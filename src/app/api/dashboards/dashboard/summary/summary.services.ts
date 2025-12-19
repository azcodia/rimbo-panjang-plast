import HistoryTransaction from "@/models/History-Transaction";

export const getInventorySummary = async () => {
  const result = await HistoryTransaction.aggregate([
    { $match: { deleted: { $ne: true } } },
    {
      $facet: {
        restock: [
          { $match: { type: "in" } },
          {
            $group: {
              _id: null,
              total_qty: { $sum: "$quantity" },
              total_transactions: { $sum: 1 },
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
          {
            $match: {
              type: "out",
              total_price: { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              total_amount: { $sum: "$total_price" },
              total_transactions: { $sum: 1 },
            },
          },
        ],

        stock: [
          {
            $group: {
              _id: "$type",
              total: { $sum: "$quantity" },
            },
          },
        ],
      },
    },
  ]);

  const data = result[0];

  const restock = data.restock[0] || { total_qty: 0, total_transactions: 0 };
  const delivery = data.delivery[0] || { total_qty: 0, total_transactions: 0 };
  const sales = data.sales[0] || { total_amount: 0 };

  let stockIn = 0;
  let stockOut = 0;
  let stockAdjust = 0;

  for (const s of data.stock) {
    if (s._id === "in") stockIn = s.total;
    if (s._id === "out") stockOut = s.total;
    if (s._id === "adjust") stockAdjust = s.total;
  }

  const totalStock = stockIn - stockOut + stockAdjust;

  return {
    total_stock: totalStock,
    restock,
    delivery,
    sales,
  };
};
