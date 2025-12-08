import mongoose, { Schema, Document } from "mongoose";

export interface IStock extends Document {
  color_id: mongoose.Types.ObjectId;
  size_id: mongoose.Types.ObjectId;
  heavy_id: mongoose.Types.ObjectId;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

const StockSchema: Schema = new Schema<IStock>({
  color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
  heavy_id: { type: Schema.Types.ObjectId, ref: "Heavy", required: true },
  quantity: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

StockSchema.index({ color_id: 1, size_id: 1, heavy_id: 1 }, { unique: true });

export default mongoose.models.Stock ||
  mongoose.model<IStock>("Stock", StockSchema);
