"use client";

import { useEffect, useMemo, useState } from "react";
import MiniTable from "@/components/table/MiniTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatWeight } from "@/lib/formatWeight";

import { fetchTopCustomer } from "../../services/topCustomer.service";

export interface TopCustomerData {
  customer_id: string;
  customer_name: string;
  total_weight: number;
}

export default function TopCustomers() {
  const [items, setItems] = useState<TopCustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const pageSize = 5;

  const loadTopCustomers = async () => {
    setLoading(true);
    try {
      const result = await fetchTopCustomer(page, pageSize);

      if (Array.isArray(result.data)) {
        setItems(result.data);
        setTotalDataCount(result.total);
        setTotalPages(Math.ceil(result.total / pageSize));
      } else {
        setItems([]);
        setTotalDataCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch top customers:", error);
      setItems([]);
      setTotalDataCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopCustomers();
  }, [page]);

  const tableData = useMemo(
    () => items.map((item) => ({ data: item })),
    [items]
  );

  const columns = useMemo(
    () => [
      {
        key: "customer_name",
        label: "Nama Pelanggan",
        render: (value: string) => value ?? "-",
      },
      {
        key: "total_weight",
        label: "Total Berat",
        render: (_: number, row: TopCustomerData) =>
          row.total_weight != null ? formatWeight(row.total_weight, 1) : "-",
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center shadow rounded p-4 text-gray-500 h-80">
        <LoadingSpinner size={8} color="text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white shadow rounded p-4 h-80 overflow-y-auto scrollbar-auto-hide">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">5 Pelanggan Terpopuler</h3>
      </div>

      <MiniTable
        columns={columns as any}
        data={tableData}
        page={page}
        totalPages={totalPages}
        totalDataCount={totalDataCount}
        loading={false}
        emptyMessage="Belum ada data pelanggan"
        onPageChange={setPage}
        className="mt-4"
      />
    </div>
  );
}
