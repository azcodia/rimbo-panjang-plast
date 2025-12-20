export interface StockItem {
  id: string;
  name: string;
  stock: number;
  unit?: string;
  color?: string | null;
  size?: number | null;
  heavy?: number | null;
}

export interface StockAlertResponse {
  lowStock: StockItem[];
}

interface FetchStockAlertParams {
  threshold?: number;
}

export const fetchStockAlert = async ({
  threshold,
}: FetchStockAlertParams = {}): Promise<StockAlertResponse> => {
  const res = await fetch(
    `/api/dashboards/dashboard/stock-alert?threshold=${threshold}`
  );
  const json = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to load stock alert");
  return json.data;
};
