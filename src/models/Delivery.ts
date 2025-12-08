import mongoose, { Schema, Document } from "mongoose";

export interface IDelivery extends Document {
  code: string;
  user_id: mongoose.Types.ObjectId;
  note?: string;
  description?: string;
  created_at: Date;
  items: {
    stock_id: mongoose.Types.ObjectId;
    color_id: mongoose.Types.ObjectId;
    size_id: mongoose.Types.ObjectId;
    heavy_id: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

const DeliverySchema = new Schema<IDelivery>({
  code: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  note: { type: String },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  items: [
    {
      stock_id: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
      color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
      size_id: { type: Schema.Types.ObjectId, ref: "Size", required: true },
      heavy_id: { type: Schema.Types.ObjectId, ref: "Heavy", required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.models.Delivery ||
  mongoose.model<IDelivery>("Delivery", DeliverySchema);
