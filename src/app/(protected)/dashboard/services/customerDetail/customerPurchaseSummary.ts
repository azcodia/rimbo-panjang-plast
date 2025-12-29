export interface CustomerPurchaseSummaryData {
  total_transactions: number;
  total_quantity: number;
  total_weight: number;
  total_amount: number;
}

export interface CustomerPurchaseSummaryResponse {
  success: boolean;
  data: CustomerPurchaseSummaryData | null;
  message?: string;
}

export const fetchCustomerPurchaseSummary = async (
  customerId: string
): Promise<CustomerPurchaseSummaryResponse> => {
  console.log("customerId", customerId);

  const res = await fetch(`/api/customers/${customerId}/purchase-summary`);

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load customer purchase summary");
  }

  return {
    success: true,
    data: json.data,
  };
};
