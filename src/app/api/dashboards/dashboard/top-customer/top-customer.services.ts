import Customer from "@/models/Customer";
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

interface GetAllCustomersParams {
  page: number;
  pageSize: number;
}

export const getAllCustomersWithWeight = async ({
  page,
  pageSize,
}: GetAllCustomersParams) => {
  const skip = (page - 1) * pageSize;

  const total = await Customer.countDocuments();

  const data = await Customer.aggregate([
    {
      $lookup: {
        from: "historytransactions",
        localField: "_id",
        foreignField: "customer_id",
        as: "transactions",
      },
    },
    {
      $unwind: {
        path: "$transactions",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "heavies",
        localField: "transactions.heavy_id",
        foreignField: "_id",
        as: "heavy",
      },
    },
    {
      $group: {
        _id: "$_id",
        customer_name: { $first: "$name" },
        total_weight: {
          $sum: {
            $multiply: [
              { $ifNull: [{ $arrayElemAt: ["$heavy.weight", 0] }, 0] },
              { $ifNull: ["$transactions.quantity", 0] },
            ],
          },
        },
      },
    },
    { $sort: { total_weight: -1 } },
    { $skip: skip },
    { $limit: pageSize },
    {
      $project: {
        _id: 0,
        customer_id: "$_id",
        customer_name: 1,
        total_weight: 1,
      },
    },
  ]);

  return { total, data };
};
