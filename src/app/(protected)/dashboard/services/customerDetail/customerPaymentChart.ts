export interface CustomerPaymentChartData {
  labels: string[];
  total_billed: number[];
  total_paid: number[];
  total_unpaid: number[];
}

export interface CustomerPaymentChartResponse {
  success: boolean;
  data: CustomerPaymentChartData | null;
  message?: string;
}

export const fetchCustomerPaymentChart = async (
  customerId: string,
  startDate?: string,
  endDate?: string
): Promise<CustomerPaymentChartResponse> => {
  const params = new URLSearchParams();

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const query = params.toString();
  const url = query
    ? `/api/customers/${customerId}/payment-chart?${query}`
    : `/api/customers/${customerId}/payment-chart`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load customer payment chart");
  }

  return {
    success: true,
    data: json.data,
  };
};
