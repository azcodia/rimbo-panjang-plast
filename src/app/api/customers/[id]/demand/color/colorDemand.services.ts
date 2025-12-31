import HistoryTransaction from "@/models/History-Transaction";
import mongoose from "mongoose";

interface Params {
  customerId: string;
  startDate: string;
  endDate: string;
}

export const getCustomerColorDemandChart = async ({
  customerId,
  startDate,
  endDate,
}: Params) => {
  const customerObjectId = new mongoose.Types.ObjectId(customerId);

  const agg = await HistoryTransaction.aggregate([
    {
      $match: {
        customer_id: customerObjectId,
        type: "out",
        deleted: false,
        input_date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$input_date",
            },
          },
          color_id: "$color_id",
        },
        total_qty: { $sum: "$quantity" },
      },
    },
    {
      $lookup: {
        from: "colors",
        localField: "_id.color_id",
        foreignField: "_id",
        as: "color",
      },
    },
    { $unwind: "$color" },
    {
      $project: {
        date: "$_id.date",
        color: "$color.color",
        total_qty: 1,
        _id: 0,
      },
    },
    { $sort: { date: 1 } },
  ]);

  /**
   * Transform result to chart format
   * labels: date[]
   * series: [{ label: color, data: number[] }]
   */

  const dateSet = new Set<string>();
  const seriesMap = new Map<string, Map<string, number>>();

  agg.forEach((row) => {
    dateSet.add(row.date);

    if (!seriesMap.has(row.color)) {
      seriesMap.set(row.color, new Map());
    }

    seriesMap.get(row.color)!.set(row.date, row.total_qty);
  });

  const labels = Array.from(dateSet).sort();

  const series = Array.from(seriesMap.entries()).map(([color, values]) => ({
    label: color,
    data: labels.map((d) => values.get(d) || 0),
  }));

  return {
    labels,
    series,
  };
};
