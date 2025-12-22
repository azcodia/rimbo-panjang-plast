import Delivery, { IDelivery } from "@/models/Delivery";
import Payment from "@/models/Payment";

export const getDeliveryWithPayments = async (code: string) => {
  if (!code) return null;

  const delivery = await Delivery.findOne({ code })
    .populate("customer_id", "name")
    .lean<IDelivery & { customer_id?: { name: string } }>();

  if (!delivery) return null;

  const total_price = delivery.items.reduce((sum: number, item) => {
    return sum + (item.total_price ?? 0);
  }, 0);

  const payments = await Payment.find({ delivery_id: delivery._id }).lean();

  const total_payment = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  let status: "not_yet_paid" | "partially_paid" | "paid_off";
  if (total_payment === 0) {
    status = "not_yet_paid";
  } else if (total_payment > 0 && total_payment < total_price) {
    status = "partially_paid";
  } else {
    status = "paid_off";
  }

  return {
    code: delivery.code,
    customer_name: delivery.customer_id?.name ?? "-",
    note: delivery.note ?? "-",
    description: delivery.description ?? "-",
    input_date: delivery.input_date,
    total_price,
    total_payment,
    status,
  };
};
