import { toObjectId } from "@/lib/mongo";
import Payment from "@/models/Payment";
import mongoose from "mongoose";

interface PaymentInput {
  delivery_id: string;
  bank_id: string;
  amount: number;
  note?: string;
  input_date?: Date;
  status?: "pending" | "paid";
}

export const getPayments = async (
  deliveryId: string,
  query: any,
  skip: number,
  limit: number
) => {
  const total = await Payment.countDocuments(query);

  const data = await Payment.find({
    _id: new mongoose.Types.ObjectId(deliveryId),
  })
    .populate("delivery_id", "code")
    .populate("bank_id", "name type account_number")
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  return { total, data };
};

export const getPaymentsByDelivery = async (deliveryId: string) => {
  const payments = await Payment.find({
    delivery_id: new mongoose.Types.ObjectId(deliveryId),
  })
    .populate("bank_id", "name type account_number")
    .sort({ input_date: -1 });

  const allItems = payments.map((p: any) => ({
    _id: p._id,
    type: p.bank_id?.type,
    name: p.bank_id?.name,
    account_number: p.bank_id?.account_number,
    amount: p.amount,
    note: p.note,
    input_date: p.input_date,
  }));

  return {
    data: allItems,
    total: allItems.length,
  };
};

export const createPayment = async (data: PaymentInput) => {
  return Payment.create({
    delivery_id: toObjectId(data.delivery_id),
    bank_id: toObjectId(data.bank_id),
    amount: data.amount,
    note: data.note,
    input_date: data.input_date,
    status: data.status ?? "paid",
    paid_at: data.status === "pending" ? undefined : new Date(),
  });
};

export const updatePayment = async (
  id: string,
  data: Partial<PaymentInput>
) => {
  const payment = await Payment.findById(id);
  if (!payment) throw new Error("Payment not found");

  return Payment.findByIdAndUpdate(
    id,
    {
      bank_id: data.bank_id ? toObjectId(data.bank_id) : undefined,
      amount: data.amount,
      note: data.note,
      status: data.status,
      paid_at:
        data.status === "paid" && !payment.paid_at
          ? new Date()
          : payment.paid_at,
    },
    { new: true }
  )
    .populate("delivery_id", "code")
    .populate("bank_id", "name type account_number");
};

export const deletePayment = async (id: string) => {
  return Payment.findByIdAndDelete(id);
};
