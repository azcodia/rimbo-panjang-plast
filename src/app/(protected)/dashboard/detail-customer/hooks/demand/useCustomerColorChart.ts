import { useEffect, useState } from "react";
import {
  CustomerColorDemandChartData,
  fetchCustomerColorDemandChart,
} from "../../../services/customerDetail/demand/fetchCustomerColorDemandChart";

export function useCustomerColorChart(
  customerId: string,
  startDate: string,
  endDate: string
) {
  const [data, setData] = useState<CustomerColorDemandChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId || !startDate || !endDate) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchCustomerColorDemandChart(
          customerId,
          startDate,
          endDate
        );
        setData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load chart");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [customerId, startDate, endDate]);

  return { data, loading, error };
}
