import mongoose, { Schema, Document, Model } from "mongoose";

export type BankType = "cash" | "bank";

export interface IBank extends Document {
  type: BankType;
  name: string;
  account_name?: string;
  account_number?: string;
  note?: string;
  created_at: Date;
  updated_at: Date;
}

const BankSchema: Schema<IBank> = new Schema(
  {
    type: {
      type: String,
      enum: ["cash", "bank"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    account_name: { type: String },
    account_number: { type: String },
    note: { type: String },
  },
  {
    collection: "banks",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

BankSchema.index({ name: 1 }, { unique: true });

const Bank: Model<IBank> =
  mongoose.models.Bank || mongoose.model<IBank>("Bank", BankSchema);

export default Bank;
