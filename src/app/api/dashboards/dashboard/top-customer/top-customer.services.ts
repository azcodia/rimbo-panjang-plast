import HistoryTransaction from "@/models/History-Transaction";

interface TopCustomerParams {
  limit: number;
}

export const getTopCustomersByWeight = async ({ limit }: TopCustomerParams) => {
  const data = await HistoryTransaction.aggregate([
    {
      $match: {
        type: "out",
        deleted: { $ne: true },
        customer_id: { $ne: null },
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
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $group: {
        _id: "$customer_id",
        total_weight: {
          $sum: {
            $multiply: [{ $arrayElemAt: ["$heavy.weight", 0] }, "$quantity"],
          },
        },
        customer_name: { $first: { $arrayElemAt: ["$customer.name", 0] } },
      },
    },
    { $sort: { total_weight: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        customer_id: "$_id",
        customer_name: 1,
        total_weight: 1,
      },
    },
  ]);

  return data;
};
