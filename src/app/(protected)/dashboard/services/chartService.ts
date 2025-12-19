export const fetchChartData = async (startDate?: string, endDate?: string) => {
  let url = "/api/dashboards/dashboard/chart";
  if (startDate || endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    url += "?" + params.toString();
  }

  const res = await fetch(url);
  const json = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to load chart data");
  return json.data;
};
