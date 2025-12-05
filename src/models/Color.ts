import mongoose, { Schema, Document, Model } from "mongoose";

export interface IColor extends Document {
  color: string;
  created_at: Date;
}

const ColorSchema: Schema<IColor> = new Schema(
  {
    color: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "colors" }
);

const Color: Model<IColor> =
  mongoose.models.Color || mongoose.model<IColor>("Color", ColorSchema);

export default Color;
