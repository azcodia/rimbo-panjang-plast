import { useEffect, useState } from "react";
import {
  DashboardTransactionData,
  DashboardTransactionItem,
  fetchDashboardTransactions,
} from "../../services/recentTransactionService";

interface UseDashboardTransactionsProps {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}

export function useDashboardTransactions({
  page = 1,
  pageSize = 10,
  startDate,
  endDate,
}: UseDashboardTransactionsProps) {
  const [data, setData] = useState<DashboardTransactionItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [grandTotalWeight, setGrandTotalWeight] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res: DashboardTransactionData = await fetchDashboardTransactions(
          page,
          pageSize,
          startDate,
          endDate
        );

        const transactionData = res.data ?? [];
        setData(transactionData);

        setGrandTotal(res.grandTotal ?? 0);
        setGrandTotalWeight(res.grandTotalWeight ?? 0);
        setTotal(res.total ?? 0);
        setTotalPages(res.totalPages ?? 1);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard transactions");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, pageSize, startDate, endDate]);

  return {
    data,
    grandTotal,
    grandTotalWeight,
    total,
    totalPages,
    loading,
    error,
  };
}
