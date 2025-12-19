import { PipelineStage } from "mongoose";
import Delivery from "@/models/Delivery";

export const getRecentTransactions = async (skip: number, limit: number) => {
  const pipeline: PipelineStage[] = [
    { $sort: { created_at: -1 } },

    { $unwind: "$items" },

    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },

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
      $project: {
        code: 1,
        customer: "$customer.name",
        input_date: 1,

        color: "$color.color",
        size: "$size.size",
        heavy: "$heavy.weight",

        quantity: "$items.quantity",
        unit_price: "$items.unit_price",
        discount_per_item: "$items.discount_per_item",
        total_price: "$items.total_price",
        note: 1,
      },
    },

    { $skip: skip },
    { $limit: limit },
  ];

  const data = await Delivery.aggregate(pipeline);

  const totalAgg = await Delivery.aggregate([
    { $unwind: "$items" },
    { $count: "total" },
  ] as PipelineStage[]);

  const total = totalAgg[0]?.total || 0;

  return { total, data };
};
