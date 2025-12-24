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
  const nameTrimmed = bankData.name.trim();
  const accountNumberTrimmed = bankData.account_number?.trim();

  if (nameTrimmed && accountNumberTrimmed) {
    const exists = await BankModel.findOne({
      name: nameTrimmed,
      account_number: accountNumberTrimmed,
    });

    if (exists) {
      throw new Error("This account number already exists for this bank");
    }
  }

  return BankModel.create({
    ...bankData,
    name: nameTrimmed,
    account_number: accountNumberTrimmed,
  });
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
  const nameTrimmed = bankData.name.trim();
  const accountNumberTrimmed = bankData.account_number?.trim();

  if (nameTrimmed && accountNumberTrimmed) {
    const exists = await BankModel.findOne({
      _id: { $ne: id },
      name: nameTrimmed,
      account_number: accountNumberTrimmed,
    });

    if (exists) {
      throw new Error("This account number already exists for this bank");
    }
  }

  return BankModel.findByIdAndUpdate(
    id,
    {
      ...bankData,
      name: nameTrimmed,
      account_number: accountNumberTrimmed,
    },
    { new: true }
  );
};

export const deleteBank = async (id: string) => {
  return BankModel.findByIdAndDelete(id);
};
