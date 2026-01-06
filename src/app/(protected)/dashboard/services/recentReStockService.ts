export interface DashboardRestockItem {
  restockId: string;
  code: string;
  date: string;
  itemDetail: string;
  quantity: number;
  totalWeight: number;
  totalWeightAllItems: number;
}

export interface DashboardRestockData {
  total: number;
  grandTotalQty: number;
  grandTotalWeight: number;
  data: DashboardRestockItem[];
}

export async function fetchDashboardRestocks(
  startDate?: string,
  endDate?: string
): Promise<DashboardRestockData> {
  const params = new URLSearchParams();

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const res = await fetch(
    `/api/dashboards/dashboard/recent-restocks?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard restocks: ${res.statusText}`);
  }

  return res.json();
}
