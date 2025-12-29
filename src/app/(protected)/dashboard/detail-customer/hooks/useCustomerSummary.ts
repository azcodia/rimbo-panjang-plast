import { useEffect, useState } from "react";
import {
  CustomerSummaryData,
  fetchCustomerSummary,
} from "../../services/customerDetail/customerSummary";

export function useCustomerSummary(customerId: string | null) {
  const [data, setData] = useState<CustomerSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchCustomerSummary(customerId);
        setData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load customer summary");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [customerId]);

  return { data, loading, error };
}
