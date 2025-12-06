import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeavy extends Document {
  weight: number;
  created_at: Date;
  updated_at: Date;
}

const HeavySchema: Schema<IHeavy> = new Schema(
  {
    weight: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "heavies" }
);

HeavySchema.index({ weight: 1 }, { unique: true });

const Heavy: Model<IHeavy> =
  mongoose.models.Heavy || mongoose.model<IHeavy>("Heavy", HeavySchema);

export default Heavy;
