export interface RecentTransaction {
  code: string;
  customer: string;
  input_date: string;
  color: string;
  size: string;
  heavy: string;
  quantity: number;
  unit_price: number;
  discount_per_item: number;
  total_price: number;
  note?: string;
}

interface RecentTransactionResponse {
  total: number;
  data: RecentTransaction[];
}

export const fetchRecentTransactions = async (
  page: number,
  pageSize: number
): Promise<RecentTransactionResponse> => {
  const res = await fetch(
    `/api/dashboards/dashboard/recent-transactions?page=${page}&pageSize=${pageSize}`
  );

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load recent transactions");
  }

  return {
    total: json.total,
    data: json.data,
  };
};
