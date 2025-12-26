export interface TopCustomerData {
  customer_id: string;
  customer_name: string;
  total_weight: number;
}

export interface TopCustomerResponse {
  total: number;
  data: TopCustomerData[];
}

export const fetchTopCustomer = async (
  page: number,
  pageSize: number
): Promise<TopCustomerResponse> => {
  const res = await fetch(
    `/api/dashboards/dashboard/top-customer?page=${page}&pageSize=${pageSize}`
  );
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to load top customer data");
  }

  return {
    total: json.total,
    data: json.data,
  };
};
