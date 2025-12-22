import mongoose, { Schema, Document, Model } from "mongoose";

export type PaymentStatus = "pending" | "paid";

export interface IPayment extends Document {
  delivery_id: mongoose.Types.ObjectId;
  bank_id: mongoose.Types.ObjectId;
  amount: number;
  note?: string;
  paid_at?: Date;
  status: PaymentStatus;
  created_at: Date;
  updated_at: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    delivery_id: {
      type: Schema.Types.ObjectId,
      ref: "Delivery",
      required: true,
      index: true,
    },
    bank_id: {
      type: Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
    },
    paid_at: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "paid",
    },
  },
  {
    collection: "payments",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

PaymentSchema.index({ delivery_id: 1, created_at: -1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
