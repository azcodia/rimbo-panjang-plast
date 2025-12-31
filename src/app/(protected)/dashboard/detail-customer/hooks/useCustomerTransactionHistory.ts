import { useEffect, useState } from "react";
import {
  CustomerTransactionItem,
  CustomerTransactionHistoryData,
  fetchCustomerTransactionHistory,
} from "../../services/customerDetail/customerTransactionHistory";

interface UseCustomerTransactionHistoryProps {
  customerId: string | null;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}

export function useCustomerTransactionHistory({
  customerId,
  page = 1,
  pageSize = 10,
  startDate,
  endDate,
}: UseCustomerTransactionHistoryProps) {
  const [data, setData] = useState<CustomerTransactionItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [grandTotalWeight, setGrandTotalWeight] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const load = async () => {
      try {
        setLoading(true);
        const res: CustomerTransactionHistoryData =
          await fetchCustomerTransactionHistory(
            customerId,
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
        setError(err.message || "Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [customerId, page, pageSize, startDate, endDate]);

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
