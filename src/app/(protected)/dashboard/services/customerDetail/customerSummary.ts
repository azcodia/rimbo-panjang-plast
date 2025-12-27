export interface CustomerSummaryData {
  customer: {
    _id: string;
    type: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  finance: {
    total_tagihan: number;
    total_dibayar: number;
    sisa_piutang: number;
    total_invoice_pending: number;
  };
  totals: {
    quantity: number;
    weight: number;
    payment: number;
  };
  insights: {
    last_transaction_date: string | null;
    avg_discount_percent: number;
  };
}

export interface CustomerSummaryResponse {
  success: boolean;
  data: CustomerSummaryData | null;
  message?: string;
}

export const fetchCustomerSummary = async (
  customerId: string
): Promise<CustomerSummaryResponse> => {
  console.log("customerID", customerId);
  const res = await fetch(`/api/customers/${customerId}/summary`);
  const json = await res.json();

  if (!json.success)
    throw new Error(json.message || "Failed to load customer summary");

  return {
    success: true,
    data: json.data,
  };
};
