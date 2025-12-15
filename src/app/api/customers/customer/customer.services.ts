import CustomerModel from "@/models/Customer";

export const getCustomers = async (query: any, skip: number, limit: number) => {
  const total = await CustomerModel.countDocuments(query);
  const data = await CustomerModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ created_at: -1 });

  return { total, data };
};

export const createCustomer = async (customerData: {
  name: string;
  type?: "individual" | "company";
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
}) => {
  if (customerData.email || customerData.phone) {
    const exists = await CustomerModel.findOne({
      $or: [
        customerData.email ? { email: customerData.email } : {},
        customerData.phone ? { phone: customerData.phone } : {},
      ],
    });

    if (exists)
      throw new Error("Customer with same email or phone already exists");
  }

  return CustomerModel.create(customerData);
};

export const updateCustomer = async (
  id: string,
  customerData: {
    name: string;
    type?: "individual" | "company";
    email?: string;
    phone?: string;
    address?: string;
    note?: string;
  }
) => {
  if (customerData.email || customerData.phone) {
    const exists = await CustomerModel.findOne({
      _id: { $ne: id },
      $or: [
        customerData.email ? { email: customerData.email } : {},
        customerData.phone ? { phone: customerData.phone } : {},
      ],
    });

    if (exists)
      throw new Error("Customer with same email or phone already exists");
  }

  return CustomerModel.findByIdAndUpdate(id, customerData, { new: true });
};

export const deleteCustomer = async (id: string) => {
  return CustomerModel.findByIdAndDelete(id);
};
