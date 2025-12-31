import mongoose, { PipelineStage } from "mongoose";
import Delivery from "@/models/Delivery";

interface Params {
  customerId: string;
  startDate?: string | null;
  endDate?: string | null;
  skip: number;
  limit: number;
}

export const getCustomerTransactions = async ({
  customerId,
  startDate,
  endDate,
  skip,
  limit,
}: Params) => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setMonth(new Date().getMonth() - 1));

  const customerIdMatch: any = mongoose.Types.ObjectId.isValid(customerId)
    ? new mongoose.Types.ObjectId(customerId)
    : customerId;

  const dataPipeline: PipelineStage[] = [
    {
      $match: {
        customer_id: customerIdMatch,
        input_date: { $gte: start, $lte: end },
      },
    },
    { $addFields: { _totalDeliveryCalc: { $sum: "$items.total_price" } } },
    {
      $lookup: {
        from: "payments",
        let: { deliveryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$delivery_id", "$$deliveryId"] },
              input_date: { $gte: start, $lte: end },
            },
          },
        ],
        as: "payments",
      },
    },
    {
      $addFields: { totalPaid: { $ifNull: [{ $sum: "$payments.amount" }, 0] } },
    },
    {
      $addFields: {
        status: {
          $cond: [
            { $gte: ["$totalPaid", "$_totalDeliveryCalc"] },
            "paid",
            {
              $cond: [
                {
                  $and: [
                    { $gt: ["$totalPaid", 0] },
                    { $lt: ["$totalPaid", "$_totalDeliveryCalc"] },
                  ],
                },
                "partially_paid",
                "unpaid",
              ],
            },
          ],
        },
        remaining: { $subtract: ["$_totalDeliveryCalc", "$totalPaid"] },
      },
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "colors",
        localField: "items.color_id",
        foreignField: "_id",
        as: "color",
      },
    },
    { $unwind: "$color" },
    {
      $lookup: {
        from: "sizes",
        localField: "items.size_id",
        foreignField: "_id",
        as: "size",
      },
    },
    { $unwind: "$size" },
    {
      $lookup: {
        from: "heavies",
        localField: "items.heavy_id",
        foreignField: "_id",
        as: "heavy",
      },
    },
    { $unwind: "$heavy" },
    {
      $addFields: {
        totalWeight: { $multiply: ["$items.quantity", "$heavy.weight"] },
      },
    },
    {
      $group: {
        _id: "$_id",
        deliveryId: { $first: "$_id" },
        code: { $first: "$code" },
        date: { $first: "$input_date" },
        totalPaid: { $first: "$totalPaid" },
        remaining: { $first: "$remaining" },
        status: { $first: "$status" },
        items: { $push: "$items" },
        colors: { $push: "$color" },
        sizes: { $push: "$size" },
        heavies: { $push: "$heavy" },
        totalWeights: { $push: "$totalWeight" },
      },
    },
    { $addFields: { totalWeightAllItems: { $sum: "$totalWeights" } } },
    { $unwind: { path: "$items", includeArrayIndex: "idx" } },
    {
      $project: {
        _id: 0,
        deliveryId: 1,
        code: 1,
        date: 1,
        totalPaid: 1,
        remaining: 1,
        status: 1,
        itemDetail: {
          $concat: [
            { $arrayElemAt: ["$colors.color", "$idx"] },
            " / ",
            { $toString: { $arrayElemAt: ["$sizes.size", "$idx"] } },
            "cm / ",
            { $toString: { $arrayElemAt: ["$heavies.weight", "$idx"] } },
            "g",
          ],
        },
        quantity: "$items.quantity",
        unit_price: "$items.unit_price",
        discount_per_item: "$items.discount_per_item",
        total_price: "$items.total_price",
        totalWeight: { $arrayElemAt: ["$totalWeights", "$idx"] },
        totalWeightAllItems: 1,
      },
    },
    { $sort: { date: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const data = await Delivery.aggregate(dataPipeline);

  const totalPipeline: PipelineStage[] = [
    {
      $match: {
        customer_id: customerIdMatch,
        input_date: { $gte: start, $lte: end },
      },
    },
    { $unwind: "$items" },
    { $count: "total" },
  ];
  const totalResult = await Delivery.aggregate(totalPipeline);
  const total = totalResult[0]?.total || 0;

  const grandTotalPipeline: PipelineStage[] = [
    {
      $match: {
        customer_id: customerIdMatch,
        input_date: { $gte: start, $lte: end },
      },
    },
    { $unwind: "$items" },
    { $group: { _id: null, grandTotal: { $sum: "$items.total_price" } } },
  ];
  const grandTotalResult = await Delivery.aggregate(grandTotalPipeline);
  const grandTotal = grandTotalResult[0]?.grandTotal || 0;

  const grandTotalWeightPipeline: PipelineStage[] = [
    {
      $match: {
        customer_id: customerIdMatch,
        input_date: { $gte: start, $lte: end },
      },
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "heavies",
        localField: "items.heavy_id",
        foreignField: "_id",
        as: "heavy",
      },
    },
    { $unwind: "$heavy" },
    {
      $group: {
        _id: null,
        grandTotalWeight: {
          $sum: { $multiply: ["$items.quantity", "$heavy.weight"] },
        },
      },
    },
  ];
  const grandTotalWeightResult = await Delivery.aggregate(
    grandTotalWeightPipeline
  );
  const grandTotalWeight = grandTotalWeightResult[0]?.grandTotalWeight || 0;

  return {
    data,
    total,
    grandTotal,
    grandTotalWeight,
    page: Math.floor(skip / limit) + 1,
    pageSize: limit,
  };
};
