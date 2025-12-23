import Payment from "@/models/Payment";
import mongoose from "mongoose";

export const deletePaymentsByDeliveryId = async (deliveryId: string) => {
  return Payment.deleteMany({
    delivery_id: new mongoose.Types.ObjectId(deliveryId),
  });
};
