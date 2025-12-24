import mongoose, { Schema, Document, Model } from "mongoose";

export type CustomerType = "per/orang" | "warung";

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
      enum: ["per/orang", "warung"],
      default: "per/orang",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      default: undefined,
      set: (v: string) => (v?.trim() === "" ? undefined : v),
    },

    phone: {
      type: String,
      trim: true,
      default: undefined,
      set: (v: string) => (v?.trim() === "" ? undefined : v),
    },

    address: {
      type: String,
      default: undefined,
    },

    note: {
      type: String,
      default: undefined,
    },
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
