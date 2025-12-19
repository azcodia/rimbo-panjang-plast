import HistoryTransaction from "@/models/History-Transaction";

export const getChartData = async (startDate?: string, endDate?: string) => {
  const match: any = { deleted: { $ne: true } };
  if (startDate) match.input_date = { $gte: new Date(startDate) };
  if (startDate && endDate)
    match.input_date = { $gte: new Date(startDate), $lte: new Date(endDate) };

  const data = await HistoryTransaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$input_date" } },
          type: "$type",
        },
        total_qty: { $sum: "$quantity" },
        total_amount: { $sum: "$total_price" },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  const chartData: Record<
    string,
    { in: number; out: number; adjust: number; sales: number }
  > = {};

  data.forEach((item) => {
    const date = item._id.date;
    if (!chartData[date])
      chartData[date] = { in: 0, out: 0, adjust: 0, sales: 0 };

    if (item._id.type === "in") chartData[date].in = item.total_qty;
    if (item._id.type === "out") chartData[date].out = item.total_qty;
    if (item._id.type === "adjust") chartData[date].adjust = item.total_qty;
    if (item._id.type === "out" && item.total_amount)
      chartData[date].sales = item.total_amount;
  });

  return Object.keys(chartData)
    .sort()
    .map((date) => ({ date, ...chartData[date] }));
};
