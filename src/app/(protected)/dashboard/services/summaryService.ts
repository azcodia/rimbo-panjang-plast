export const fetchSummary = async () => {
  const res = await fetch("/api/dashboards/dashboard/summary");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load summary");
  return json.data;
};
