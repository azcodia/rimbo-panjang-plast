import Delivery from "@/models/Delivery";
import mongoose from "mongoose";

export const getDeliveryItemsByCodePaginated = async (
  deliveryId: string,
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;

  const deliveries = await Delivery.find({
    _id: new mongoose.Types.ObjectId(deliveryId),
  })
    .populate("items.color_id", "color")
    .populate("items.size_id", "size")
    .populate("items.heavy_id", "weight")
    .sort({ created_at: -1 });

  const allItems = deliveries.flatMap((delivery: any) =>
    delivery.items.map((item: any) => ({
      color: item.color_id?.color ?? "-",
      size: item.size_id?.size ?? null,
      weight: item.heavy_id?.weight ?? null,
      quantity: item.quantity ?? 0,
      unit_price: item.unit_price ?? 0,
      discount_per_item: item.discount_per_item ?? 0,
      total_price: item.total_price ?? 0,
    }))
  );

  allItems.sort((a, b) => {
    const colorCompare = (a.color ?? "").localeCompare(b.color ?? "");
    if (colorCompare !== 0) return colorCompare;

    const sizeA = a.size ?? Number.MIN_SAFE_INTEGER;
    const sizeB = b.size ?? Number.MIN_SAFE_INTEGER;
    return sizeA - sizeB;
  });

  const paginatedItems = allItems.slice(skip, skip + pageSize);

  return {
    items: paginatedItems,
    total: allItems.length,
  };
};
