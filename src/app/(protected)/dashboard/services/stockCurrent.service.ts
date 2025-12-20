export interface StockCurrentData {
  id: string;
  color_id: string;
  color: string;
  size_id: string | null;
  size: string | number;
  heavy_id: string | number;
  heavy: string | number;
  quantity: number;
  tokenHistory: string;
  input_date: string;
  created_at: string;
}

export interface StockCurrentResponse {
  total: number;
  data: StockCurrentData[];
}

export const fetchCurrentStock = async (
  page: number,
  pageSize: number
): Promise<StockCurrentResponse> => {
  const res = await fetch(
    `/api/dashboards/dashboard/stock-current?page=${page}&pageSize=${pageSize}`
  );
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load current stock");
  }

  return {
    total: json.total,
    data: json.data,
  };
};
