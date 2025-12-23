import { toObjectId } from "@/lib/mongo";
import Delivery from "@/models/Delivery";
import Payment from "@/models/Payment";

interface DeliveryItemInput {
  stock_id: string;
  color_id: string;
  size_id: string;
  heavy_id: string;
  quantity: number;
  unit_price?: number;
  discount_per_item?: number;
  total_price?: number;
  tokenHistory: string;
}

interface DeliveryInput {
  code: string;
  user_id: string;
  customer_id?: string;
  note?: string;
  description?: string;
  input_date?: Date;
  items: DeliveryItemInput[];
}

/**
 * GET LIST
 */

interface DeliveryItem {
  total_price?: number;
}

export const getDeliveries = async (
  query: any,
  skip: number,
  limit: number
) => {
  const total = await Delivery.countDocuments(query);

  const deliveries = await Delivery.find(query)
    .populate("user_id", "name email")
    .populate("customer_id", "name type")
    .populate("items.stock_id")
    .populate("items.color_id")
    .populate("items.size_id")
    .populate("items.heavy_id")
    .skip(skip)
    .limit(limit)
    .sort({ input_date: -1 });

  const data = await Promise.all(
    deliveries.map(async (delivery) => {
      const totalPrice = (delivery.items as DeliveryItem[]).reduce(
        (sum, item) => sum + (item.total_price || 0),
        0
      );

      const payments = await Payment.aggregate([
        { $match: { delivery_id: delivery._id } },
        { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
      ]);

      const totalPaid = payments.length > 0 ? payments[0].totalPaid : 0;

      // Tentukan status
      let status: "paid" | "partially_paid" | "unpaid";
      if (totalPaid >= totalPrice) {
        status = "paid";
      } else if (totalPaid > 0 && totalPaid < totalPrice) {
        status = "partially_paid";
      } else {
        status = "unpaid";
      }

      return {
        ...delivery.toObject(),
        status,
      };
    })
  );

  return { total, data };
};

/**
 * CREATE DELIVERY
 */
export const createDelivery = async (data: DeliveryInput) => {
  const normalizedCode = data.code.trim().toUpperCase();

  const exists = await Delivery.findOne({ code: normalizedCode });
  if (exists)
    throw new Error(`Delivery code "${normalizedCode}" already exists`);

  const items = data.items.map((i) => ({
    stock_id: toObjectId(i.stock_id),
    color_id: toObjectId(i.color_id),
    size_id: toObjectId(i.size_id),
    heavy_id: toObjectId(i.heavy_id),
    quantity: i.quantity,
    unit_price: i.unit_price,
    discount_per_item: i.discount_per_item ?? 0,
    total_price: i.total_price,
    tokenHistory: i.tokenHistory,
  }));

  return Delivery.create({
    code: normalizedCode,
    user_id: toObjectId(data.user_id),
    customer_id: data.customer_id ? toObjectId(data.customer_id) : undefined,
    note: data.note,
    description: data.description,
    input_date: data.input_date ? new Date(data.input_date) : new Date(),
    items,
  });
};

/**
 * UPDATE DELIVERY
 */
export const updateDelivery = async (id: string, data: DeliveryInput) => {
  const delivery = await Delivery.findById(id);
  if (!delivery) throw new Error("Delivery not found");

  const items = data.items.map((i) => ({
    stock_id: toObjectId(i.stock_id),
    color_id: toObjectId(i.color_id),
    size_id: toObjectId(i.size_id),
    heavy_id: toObjectId(i.heavy_id),
    quantity: i.quantity,
    unit_price: i.unit_price,
    discount_per_item: i.discount_per_item ?? 0,
    total_price: i.total_price,
    tokenHistory: i.tokenHistory,
  }));

  return Delivery.findByIdAndUpdate(
    id,
    {
      code: data.code,
      user_id: toObjectId(data.user_id),
      customer_id: data.customer_id ? toObjectId(data.customer_id) : undefined,
      note: data.note,
      description: data.description,
      input_date: data.input_date ? new Date(data.input_date) : new Date(),
      items,
    },
    { new: true }
  )
    .populate("user_id", "name email")
    .populate("customer_id", "name type")
    .populate("items.stock_id")
    .populate("items.color_id")
    .populate("items.size_id")
    .populate("items.heavy_id");
};

/**
 * DELETE DELIVERY
 */
export const deleteDelivery = async (id: string) => {
  return Delivery.findByIdAndDelete(id);
};
