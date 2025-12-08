import SizeModel from "@/models/Size";

export const getSizes = async (query: any, skip: number, limit: number) => {
  const total = await SizeModel.countDocuments(query);
  const data = await SizeModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 })
    .populate("color_id", "color");
  return { total, data };
};

export const createSize = async (color_id: string, size: number) => {
  const exists = await SizeModel.findOne({ color_id, size });
  if (exists) throw new Error("Size already exists for this color");
  return SizeModel.create({ color_id, size });
};

export const updateSize = async (
  id: string,
  color_id: string,
  size: number
) => {
  const exists = await SizeModel.findOne({
    color_id,
    size,
    _id: { $ne: id },
  });
  if (exists) throw new Error("Size already exists for this color");
  return SizeModel.findByIdAndUpdate(
    id,
    { color_id, size, updated_at: new Date() },
    { new: true }
  );
};

export const deleteSize = async (id: string) => {
  return SizeModel.findByIdAndDelete(id);
};
