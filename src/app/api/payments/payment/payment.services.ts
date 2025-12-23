import { toObjectId } from "@/lib/mongo";
import Payment from "@/models/Payment";

interface PaymentInput {
  delivery_id: string;
  bank_id: string;
  amount: number;
  note?: string;
  status?: "pending" | "paid";
}

export const getPayments = async (query: any, skip: number, limit: number) => {
  const total = await Payment.countDocuments(query);

  const data = await Payment.find(query)
    .populate("delivery_id", "code")
    .populate("bank_id", "name type account_number")
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  return { total, data };
};

export const createPayment = async (data: PaymentInput) => {
  return Payment.create({
    delivery_id: toObjectId(data.delivery_id),
    bank_id: toObjectId(data.bank_id),
    amount: data.amount,
    note: data.note,
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
