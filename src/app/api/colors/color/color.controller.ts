import ColorModel from "@/models/Color";

export const getColors = async (query: any, skip: number, limit: number) => {
  const total = await ColorModel.countDocuments(query);
  const data = await ColorModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });
  return { total, data };
};

export const createColor = async (color: string) => {
  const exists = await ColorModel.findOne({ color });
  if (exists) throw new Error("Color already exists");
  return ColorModel.create({ color });
};

export const updateColor = async (id: string, color: string) => {
  const exists = await ColorModel.findOne({ color, _id: { $ne: id } });
  if (exists) throw new Error("Color already exists");
  return ColorModel.findByIdAndUpdate(id, { color }, { new: true });
};

export const deleteColor = async (id: string) => {
  return ColorModel.findByIdAndDelete(id);
};
