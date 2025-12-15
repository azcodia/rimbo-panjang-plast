import mongoose, { Schema, Document, Model } from "mongoose";

export type CustomerType = "individual" | "company";

export interface ICustomer extends Document {
  type: CustomerType;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  created_at: Date;
  updated_at: Date;
}

const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    type: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, sparse: true },
    phone: { type: String, sparse: true },
    address: { type: String },
    note: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: "customers",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;
