import { Schema, Document, models, model } from "mongoose";
import { IColor } from "./Color";

export interface ISize extends Document {
  color_id: IColor["_id"];
  size: number;
  created_at: Date;
  updated_at: Date;
}

const SizeSchema: Schema = new Schema<ISize>(
  {
    color_id: { type: Schema.Types.ObjectId, ref: "Color", required: true },
    size: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "sizes" }
);

SizeSchema.index({ color_id: 1, size: 1 }, { unique: true });

const SizeModel = models.Size || model<ISize>("Size", SizeSchema);

export default SizeModel;
