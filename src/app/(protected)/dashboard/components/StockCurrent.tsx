"use client";

import { useEffect, useMemo, useState } from "react";

import MiniTable from "@/components/table/MiniTable";
import LoadingSpinner from "@/components/LoadingSpinner";

import { threshold } from "@/lib/constanta";
import { formatNumber } from "@/lib/formatNumber";
import { groupAndSortStock } from "@/lib/groupedStock";

import {
  fetchCurrentStock,
  StockCurrentData,
} from "../services/stockCurrent.service";

export default function StockCurrent() {
  const [stock, setStock] = useState<StockCurrentData[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const pageSize = 5;

  const loadStock = async () => {
    setLoading(true);
    try {
      const result = await fetchCurrentStock(page, pageSize);
      setStock(result.data);
      setTotalDataCount(result.total);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error("Failed to fetch stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, [page]);

  const groupedData = useMemo(() => groupAndSortStock(stock), [stock]);

  const columns = useMemo(
    () => [
      { key: "color", label: "Warna" },
      {
        key: "size",
        label: "Ukuran",
        render: (_: unknown, row: StockCurrentData) => `${row.size} cm`,
      },
      {
        key: "heavy",
        label: "Berat",
        render: (_: unknown, row: StockCurrentData) => `${row.heavy} gram`,
      },
      {
        key: "quantity",
        label: "Quantity",
        render: (_: unknown, row: StockCurrentData) =>
          formatNumber(row.quantity ?? 0),
      },
      {
        key: "status",
        label: "Status",
        render: (_: unknown, row: StockCurrentData) => {
          if (row.quantity === 0)
            return <span className="text-danger">❌ Habis</span>;
          if (row.quantity < threshold)
            return <span className="text-orange-400">⚠ Menipis</span>;
          return <span className="text-success-light">✅ Aman</span>;
        },
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white flex items-center justify-center shadow rounded p-4 text-gray-500 h-80"
          >
            <LoadingSpinner size={8} color="text-gray-500" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Stock Table */}
      <div className="flex flex-col bg-white shadow rounded p-4 h-80 overflow-y-auto scrollbar-auto-hide">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Stok Saat Ini</h3>
        </div>

        <MiniTable
          columns={columns as any}
          data={groupedData}
          page={page}
          totalPages={totalPages}
          totalDataCount={totalDataCount}
          loading={false}
          emptyMessage="Tidak ada stock saat ini"
          onPageChange={setPage}
          className="mt-4"
        />
      </div>

      {/* Right Card */}
      <div className="bg-white shadow rounded p-4 flex items-center justify-center text-gray-400">
        Comming Soon!!!
      </div>
    </div>
  );
}
