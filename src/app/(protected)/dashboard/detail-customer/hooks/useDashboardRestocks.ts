import { useEffect, useState } from "react";
import {
  DashboardRestockItem,
  fetchDashboardRestocks,
} from "../../services/recentReStockService";

export function useDashboardRestocks({
  startDate,
  endDate,
}: {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}) {
  const [data, setData] = useState<DashboardRestockItem[]>([]);
  const [grandTotalQty, setGrandTotalQty] = useState(0);
  const [grandTotalWeight, setGrandTotalWeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await fetchDashboardRestocks(startDate, endDate);

        setData(res.data ?? []);
        setGrandTotalQty(res.grandTotalQty ?? 0);
        setGrandTotalWeight(res.grandTotalWeight ?? 0);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load restocks");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [startDate, endDate]);

  return {
    data,
    grandTotalQty,
    grandTotalWeight,
    loading,
    error,
  };
}
