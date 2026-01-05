export interface DashboardTransactionItem {
  deliveryId: string;
  code: string;
  date: string;

  customerName: string;

  itemDetail: string;
  quantity: number;
  unit_price: number;
  discount_per_item: number;
  total_price: number;

  totalPaid: number;
  totalWeight: number;
  totalWeightAllItems: number;
  remaining: number;

  status: "paid" | "partially_paid" | "unpaid";
}

export interface DashboardTransactionData {
  total: number;
  grandTotal: number;
  grandTotalWeight: number;
  data: DashboardTransactionItem[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchDashboardTransactions(
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string
): Promise<DashboardTransactionData> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const res = await fetch(
    `/api/dashboards/dashboard/recent-transactions?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch dashboard transactions: ${res.statusText}`
    );
  }

  return res.json();
}
