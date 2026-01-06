import ReStock from "@/models/Re-Stock";
import { PipelineStage } from "mongoose";

interface Params {
  startDate?: string | null;
  endDate?: string | null;
}

export const getDashboardRestocks = async ({ startDate, endDate }: Params) => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setMonth(new Date().getMonth() - 1));

  const dateMatch = {
    input_date: { $gte: start, $lte: end },
  };

  const dataPipeline: PipelineStage[] = [
    { $match: dateMatch },
    { $sort: { input_date: 1 } },
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
        totalWeight: {
          $multiply: ["$items.quantity", "$heavy.weight"],
        },
      },
    },

    {
      $group: {
        _id: "$_id",
        code: { $first: "$code" },
        date: { $first: "$input_date" },

        totalWeightAllItems: { $sum: "$totalWeight" },

        items: {
          $push: {
            itemDetail: {
              $concat: [
                "$color.color",
                " / ",
                { $toString: "$size.size" },
                "cm / ",
                { $toString: "$heavy.weight" },
                "g",
              ],
            },
            quantity: "$items.quantity",
            totalWeight: "$totalWeight",
          },
        },
      },
    },

    { $unwind: "$items" },

    {
      $project: {
        _id: 0,
        restockId: "$_id",
        code: 1,
        date: 1,

        itemDetail: "$items.itemDetail",
        quantity: "$items.quantity",
        totalWeight: "$items.totalWeight",

        totalWeightAllItems: 1,
      },
    },
  ];

  const data = await ReStock.aggregate(dataPipeline);

  const totalPipeline: PipelineStage[] = [
    { $match: dateMatch },
    { $unwind: "$items" },
    { $count: "total" },
  ];

  const totalResult = await ReStock.aggregate(totalPipeline);
  const total = totalResult[0]?.total ?? 0;

  const grandTotalQtyPipeline: PipelineStage[] = [
    { $match: dateMatch },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        grandTotalQty: { $sum: "$items.quantity" },
      },
    },
  ];

  const grandTotalQtyResult = await ReStock.aggregate(grandTotalQtyPipeline);
  const grandTotalQty = grandTotalQtyResult[0]?.grandTotalQty ?? 0;

  const grandTotalWeightPipeline: PipelineStage[] = [
    { $match: dateMatch },
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

  const grandTotalWeightResult = await ReStock.aggregate(
    grandTotalWeightPipeline
  );
  const grandTotalWeight = grandTotalWeightResult[0]?.grandTotalWeight ?? 0;

  return {
    data,
    total,
    grandTotalQty,
    grandTotalWeight,
  };
};
