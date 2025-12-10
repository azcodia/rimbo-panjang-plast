import mongoose, { Schema, Document } from "mongoose";

export interface IReStockItem {
  stock_id: mongoose.Types.ObjectId;
  color_id: mongoose.Types.ObjectId;
  size_id: mongoose.Types.ObjectId;
  heavy_id: mongoose.Types.ObjectId;
  quantity: number;
  tokenHistory: string;
}

export interface IReStock extends Document {
  code: string;
  user_id: mongoose.Types.ObjectId;
  note?: string;
  description?: string;
  created_at: Date;
  input_date: Date;
  items: IReStockItem[];
}

const ReStockSchema = new Schema<IReStock>(
  {
    code: { type: String, required: true, unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
    description: { type: String },
    created_at: { type: Date, default: Date.now },
    input_date: { type: Date, required: true },
    items: [
      {
        stock_id: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
        color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
        size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
        heavy_id: { type: Schema.Types.ObjectId, ref: "Heavy", required: true },
        quantity: { type: Number, required: true },
        tokenHistory: { type: String, required: true },
      },
    ],
  },
  { collection: "restocks" }
);

export default mongoose.models.ReStock ||
  mongoose.model<IReStock>("ReStock", ReStockSchema);
