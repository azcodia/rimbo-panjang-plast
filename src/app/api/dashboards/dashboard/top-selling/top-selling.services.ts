import HistoryTransaction from "@/models/History-Transaction";

interface TopSellingParams {
  startDate?: string | null;
  endDate?: string | null;
  limit: number;
}

export const getTopSellingItems = async ({
  startDate,
  endDate,
  limit,
}: TopSellingParams) => {
  const match: any = {
    type: "out",
    deleted: { $ne: true },
  };

  if (startDate || endDate) {
    match.input_date = {};
    if (startDate) match.input_date.$gte = new Date(startDate);
    if (endDate) match.input_date.$lte = new Date(endDate);
  }

  const data = await HistoryTransaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          color_id: "$color_id",
          size_id: "$size_id",
          heavy_id: "$heavy_id",
        },
        total_qty: { $sum: "$quantity" },
        total_transactions: { $sum: 1 },
      },
    },
    { $sort: { total_qty: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "colors",
        localField: "_id.color_id",
        foreignField: "_id",
        as: "color",
      },
    },
    {
      $lookup: {
        from: "sizes",
        localField: "_id.size_id",
        foreignField: "_id",
        as: "size",
      },
    },
    {
      $lookup: {
        from: "heavies",
        localField: "_id.heavy_id",
        foreignField: "_id",
        as: "heavy",
      },
    },
    {
      $project: {
        _id: 0,
        color_id: "$_id.color_id",
        color: { $arrayElemAt: ["$color.color", 0] },
        size: { $arrayElemAt: ["$size.size", 0] },
        heavy: { $arrayElemAt: ["$heavy.weight", 0] },
        total_qty: 1,
        total_transactions: 1,
      },
    },
  ]);

  return data;
};
