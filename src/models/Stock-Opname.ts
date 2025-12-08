import mongoose, { Schema, Document } from "mongoose";

export interface IStockOpname extends Document {
  stock_id: mongoose.Types.ObjectId;
  color_id: mongoose.Types.ObjectId;
  size_id: mongoose.Types.ObjectId;
  heavy_id: mongoose.Types.ObjectId;
  quantity_system: number;
  quantity_actual: number;
  difference: number;
  note?: string;
  user_id: mongoose.Types.ObjectId;
  created_at: Date;
}

const StockOpnameSchema = new Schema<IStockOpname>({
  stock_id: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
  color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
  heavy_id: { type: Schema.Types.ObjectId, ref: "Heavy", required: true },
  quantity_system: { type: Number, required: true },
  quantity_actual: { type: Number, required: true },
  difference: { type: Number, required: true },
  note: { type: String },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.StockOpname ||
  mongoose.model<IStockOpname>("StockOpname", StockOpnameSchema);
