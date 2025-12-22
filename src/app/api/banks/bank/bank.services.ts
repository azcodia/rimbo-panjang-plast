import BankModel from "@/models/Bank";

export const getBanks = async (query: any, skip: number, limit: number) => {
  const total = await BankModel.countDocuments(query);
  const data = await BankModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  return { total, data };
};

export const createBank = async (bankData: {
  type: "cash" | "bank";
  name: string;
  account_name?: string;
  account_number?: string;
  note?: string;
}) => {
  const exists = await BankModel.findOne({ name: bankData.name });
  if (exists) throw new Error("Bank name already exists");

  return BankModel.create(bankData);
};

export const updateBank = async (
  id: string,
  bankData: {
    type?: "cash" | "bank";
    name: string;
    account_name?: string;
    account_number?: string;
    note?: string;
  }
) => {
  const exists = await BankModel.findOne({
    _id: { $ne: id },
    name: bankData.name,
  });

  if (exists) throw new Error("Bank name already exists");

  return BankModel.findByIdAndUpdate(id, bankData, { new: true });
};

export const deleteBank = async (id: string) => {
  return BankModel.findByIdAndDelete(id);
};
