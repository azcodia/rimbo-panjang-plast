import HeavyModel from "@/models/Heavy";

export const getHeavies = async (query: any, skip: number, limit: number) => {
  const total = await HeavyModel.countDocuments(query);
  const data = await HeavyModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });
  return { total, data };
};

export const createHeavy = async (weight: number) => {
  const exists = await HeavyModel.findOne({ weight });
  if (exists) throw new Error("Weight already exists");
  return HeavyModel.create({ weight });
};

export const updateHeavy = async (id: string, weight: number) => {
  const exists = await HeavyModel.findOne({ weight, _id: { $ne: id } });
  if (exists) throw new Error("Weight already exists");
  return HeavyModel.findByIdAndUpdate(
    id,
    { weight, updated_at: new Date() },
    { new: true }
  );
};

export const deleteHeavy = async (id: string) => {
  return HeavyModel.findByIdAndDelete(id);
};
