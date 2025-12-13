import mongoose, { Schema, Document } from "mongoose";

export interface IHistoryTransaction extends Document {
  stock_id: mongoose.Types.ObjectId;
  color_id: mongoose.Types.ObjectId;
  size_id: mongoose.Types.ObjectId;
  heavy_id: mongoose.Types.ObjectId;
  type: "in" | "out" | "adjust";
  quantity: number;
  unit_price?: number;
  total_price?: number;
  note: string;
  description?: string;
  user_id: mongoose.Types.ObjectId;
  created_at: Date;
  input_date?: Date;
  deleted?: boolean;
  tokenHistory: string;
}

const HistoryTransactionSchema = new Schema<IHistoryTransaction>({
  stock_id: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
  color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
  heavy_id: { type: Schema.Types.ObjectId, ref: "Heavy", required: true },
  type: { type: String, enum: ["in", "out", "adjust"], required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number },
  total_price: { type: Number },
  note: { type: String, required: true },
  description: { type: String },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  input_date: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  tokenHistory: { type: String, required: true },
});

export default mongoose.models.HistoryTransaction ||
  mongoose.model<IHistoryTransaction>(
    "HistoryTransaction",
    HistoryTransactionSchema
  );
