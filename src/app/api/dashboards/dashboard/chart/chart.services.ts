import HistoryTransaction from "@/models/History-Transaction";
import Payment from "@/models/Payment";

export const getChartData = async (startDate?: string, endDate?: string) => {
  const match: any = { deleted: { $ne: true } };
  if (startDate) match.input_date = { $gte: new Date(startDate) };
  if (startDate && endDate)
    match.input_date = { $gte: new Date(startDate), $lte: new Date(endDate) };

  const transactions = await HistoryTransaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$input_date" } },
          type: "$type",
        },
        total_qty: { $sum: "$quantity" },
        total_price: { $sum: "$total_price" },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  const paymentMatch: any = {};
  if (startDate) paymentMatch.paid_at = { $gte: new Date(startDate) };
  if (startDate && endDate)
    paymentMatch.paid_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };

  const payments = await Payment.aggregate([
    { $match: { ...paymentMatch, status: "paid" } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$paid_at" } },
        },
        total_paid: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  const chartData: Record<
    string,
    {
      in: number;
      out: number;
      adjust: number;
      total_price: number;
      sales: number;
    }
  > = {};

  transactions.forEach((item) => {
    const date = item._id.date;
    if (!chartData[date])
      chartData[date] = { in: 0, out: 0, adjust: 0, total_price: 0, sales: 0 };

    if (item._id.type === "in") chartData[date].in = item.total_qty;
    if (item._id.type === "out") {
      chartData[date].out = item.total_qty;
      chartData[date].total_price = item.total_price || 0;
    }
    if (item._id.type === "adjust") chartData[date].adjust = item.total_qty;
  });

  payments.forEach((p) => {
    const date = p._id.date;
    if (!chartData[date])
      chartData[date] = { in: 0, out: 0, adjust: 0, total_price: 0, sales: 0 };
    chartData[date].sales = p.total_paid;
  });

  return Object.keys(chartData)
    .sort()
    .map((date) => ({ date, ...chartData[date] }));
};
