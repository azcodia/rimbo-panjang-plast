import mongoose from "mongoose";
import Delivery from "@/models/Delivery";
import Payment from "@/models/Payment";

interface Params {
  customerId: string;
  startDate?: string | null;
  endDate?: string | null;
}

export const getCustomerPaymentChart = async ({
  customerId,
  startDate,
  endDate,
}: Params) => {
  const customerObjectId = new mongoose.Types.ObjectId(customerId);

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setMonth(new Date().getMonth() - 1));

  const deliveryAgg = await Delivery.aggregate([
    {
      $match: {
        customer_id: customerObjectId,
        input_date: { $gte: start, $lte: end },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          year: { $year: "$input_date" },
          month: { $month: "$input_date" },
          day: { $dayOfMonth: "$input_date" },
        },
        total_billed: { $sum: "$items.total_price" },
      },
    },
  ]);

  const paymentAgg = await Payment.aggregate([
    {
      $lookup: {
        from: "deliveries",
        localField: "delivery_id",
        foreignField: "_id",
        as: "delivery",
      },
    },
    { $unwind: "$delivery" },
    {
      $match: {
        "delivery.customer_id": customerObjectId,
        status: "paid",
        input_date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$input_date" },
          month: { $month: "$input_date" },
          day: { $dayOfMonth: "$input_date" },
        },
        total_paid: { $sum: "$amount" },
      },
    },
  ]);

  const map = new Map<string, any>();

  deliveryAgg.forEach((d) => {
    const key = `${d._id.year}-${d._id.month}-${d._id.day}`;
    map.set(key, {
      year: d._id.year,
      month: d._id.month,
      day: d._id.day,
      total_billed: d.total_billed,
      total_paid: 0,
    });
  });

  paymentAgg.forEach((p) => {
    const key = `${p._id.year}-${p._id.month}-${p._id.day}`;
    if (!map.has(key)) {
      map.set(key, {
        year: p._id.year,
        month: p._id.month,
        day: p._id.day,
        total_billed: 0,
        total_paid: p.total_paid,
      });
    } else {
      map.get(key).total_paid = p.total_paid;
    }
  });

  const sorted = Array.from(map.values()).sort(
    (a, b) => a.year - b.year || a.month - b.month || a.day - b.day
  );

  return {
    labels: sorted.map(
      (i) =>
        `${i.day.toString().padStart(2, "0")}-${i.month
          .toString()
          .padStart(2, "0")}-${i.year}`
    ),
    total_billed: sorted.map((i) => i.total_billed),
    total_paid: sorted.map((i) => i.total_paid),
    total_unpaid: sorted.map((i) => Math.max(0, i.total_billed - i.total_paid)),
  };
};
