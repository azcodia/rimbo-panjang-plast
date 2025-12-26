export interface TopSellingData {
  color: string;
  size: string | number;
  heavy: string | number;
  total_qty: number;
  total_transactions: number;
}

export interface TopSellingResponse {
  total: number;
  data: TopSellingData[];
}

export const fetchTopSelling = async (
  page: number,
  pageSize: number
): Promise<TopSellingResponse> => {
  const res = await fetch(
    `/api/dashboards/dashboard/top-selling?limit=${pageSize}`
  );
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load top selling items");
  }

  return {
    total: json.data.length,
    data: json.data,
  };
};
