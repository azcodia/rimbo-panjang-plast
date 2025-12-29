import { useEffect, useState } from "react";
import {
  CustomerPurchaseSummaryData,
  fetchCustomerPurchaseSummary,
} from "../../services/customerDetail/customerPurchaseSummary";

export function useCustomerPurchaseSummary(customerId: string | null) {
  const [data, setData] = useState<CustomerPurchaseSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchCustomerPurchaseSummary(customerId);
        setData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load purchase summary");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [customerId]);

  return { data, loading, error };
}
