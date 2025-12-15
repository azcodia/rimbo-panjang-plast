import mongoose, { Schema, Document } from "mongoose";

export interface IDelivery extends Document {
  code: string;
  user_id: mongoose.Types.ObjectId;
  customer_id?: mongoose.Types.ObjectId;
  note?: string;
  description?: string;
  input_date: Date;
  created_at: Date;
  items: {
    stock_id: mongoose.Types.ObjectId;
    color_id: mongoose.Types.ObjectId;
    size_id: mongoose.Types.ObjectId;
    heavy_id: mongoose.Types.ObjectId;
    quantity: number;
    unit_price?: number;
    discount_per_item?: number;
    total_price?: number;
    tokenHistory: string;
  }[];
}

const DeliverySchema = new Schema<IDelivery>({
  code: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: false,
  },
  note: { type: String },
  description: { type: String },
  input_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  items: [
    {
      stock_id: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
      color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
      size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
      heavy_id: { type: Schema.Types.ObjectId, ref: "Heavy", required: true },
      quantity: { type: Number, required: true },
      unit_price: { type: Number },
      discount_per_item: { type: Number, default: 0 },
      total_price: { type: Number },
      tokenHistory: { type: String, required: true },
    },
  ],
});

export default mongoose.models.Delivery ||
  mongoose.model<IDelivery>("Delivery", DeliverySchema);
