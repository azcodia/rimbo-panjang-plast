import Delivery, { IDelivery } from "@/models/Delivery";
import Payment from "@/models/Payment";
import mongoose from "mongoose";

export const getDeliveryWithPayments = async (deliveryId: string) => {
  if (!deliveryId) return null;

  // const delivery = await Delivery.findOne({ code })
  const delivery = await Delivery.findOne({
    _id: new mongoose.Types.ObjectId(deliveryId),
  })
    .populate("customer_id", "name")
    .lean<IDelivery & { customer_id?: { name: string } }>();

  if (!delivery) return null;

  const total_price = delivery.items.reduce(
    (sum, item) => sum + (item.total_price ?? 0),
    0
  );

  const payments = await Payment.find({
    delivery_id: new mongoose.Types.ObjectId(delivery._id),
  }).lean();

  const total_payment = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  let status: "not_yet_paid" | "partially_paid" | "paid_off";
  if (total_payment === 0) {
    status = "not_yet_paid";
  } else if (total_payment < total_price) {
    status = "partially_paid";
  } else {
    status = "paid_off";
  }

  return {
    delivery_id: delivery._id,
    code: delivery.code,
    customer_name: delivery.customer_id?.name ?? "-",
    note: delivery.note ?? "-",
    description: delivery.description ?? "-",
    input_date: delivery.input_date,
    total_price,
    total_payment,
    status,
    payments_count: payments.length,
  };
};
