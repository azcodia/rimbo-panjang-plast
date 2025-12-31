export interface CustomerColorDemandSeries {
  label: string;
  data: number[];
}

export interface CustomerColorDemandChartData {
  labels: string[];
  series: CustomerColorDemandSeries[];
}

export interface CustomerColorDemandChartResponse {
  success: boolean;
  data: CustomerColorDemandChartData | null;
  message?: string;
}

export const fetchCustomerColorDemandChart = async (
  customerId: string,
  startDate?: string,
  endDate?: string
): Promise<CustomerColorDemandChartResponse> => {
  const params = new URLSearchParams();

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const query = params.toString();
  const url = query
    ? `/api/customers/${customerId}/demand/color?${query}`
    : `/api/customers/${customerId}/demand/color`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.success) {
    throw new Error(
      json.message || "Failed to load customer color demand chart"
    );
  }

  return {
    success: true,
    data: json.data,
  };
};
