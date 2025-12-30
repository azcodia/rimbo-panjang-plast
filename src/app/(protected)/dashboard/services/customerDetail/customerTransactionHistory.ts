export interface CustomerTransactionItem {
  deliveryId: string;
  code: string;
  date: string;
  itemDetail: string;
  quantity: number;
  unit_price: number;
  discount_per_item: number;
  total_price: number;
  totalPaid: number;
  remaining: number;
  status: "paid" | "partially_paid" | "unpaid";
}

export interface CustomerTransactionHistoryData {
  total: number;
  grandTotal: number;
  data: CustomerTransactionItem[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchCustomerTransactionHistory(
  customerId: string,
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string
): Promise<CustomerTransactionHistoryData> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const res = await fetch(
    `/api/customers/${customerId}/transaction-history?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch transaction history: ${res.statusText}`);
  }

  return res.json();
}
