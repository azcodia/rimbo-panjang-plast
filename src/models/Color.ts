import { Schema, Document, models, model } from "mongoose";

export interface IColor extends Document {
  color: string;
  created_at: Date;
  updated_at: Date;
}

const ColorSchema: Schema<IColor> = new Schema(
  {
    color: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "colors" }
);

ColorSchema.index({ color: 1 }, { unique: true });

const ColorModel = models.Color || model<IColor>("Color", ColorSchema);

export default ColorModel;
