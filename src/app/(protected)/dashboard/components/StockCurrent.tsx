"use client";

import MiniTable from "@/components/table/MiniTable";
import { useEffect, useMemo, useState } from "react";
import { threshold } from "@/lib/constanta";
import {
  fetchCurrentStock,
  StockCurrentData,
} from "../services/stockCurrent.service";
import { formatNumber } from "@/lib/formatNumber";
import { groupAndSortStock } from "@/lib/groupedStock";

export default function StockCurrent() {
  const [stock, setStock] = useState<StockCurrentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const pageSize = 5;

  const loadStock = async (pageNumber: number) => {
    setLoading(true);
    try {
      const result = await fetchCurrentStock(pageNumber, pageSize);
      setStock(result.data);
      setTotalDataCount(result.total);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (err) {
      console.error("Failed to fetch stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock(page);
  }, [page]);

  const groupedData = useMemo(() => groupAndSortStock(stock), [stock]);

  const columns = [
    { key: "color", label: "Color" },
    {
      key: "size",
      label: "Size",
      render: (_v: any, row: any) => `${row.size} cm`,
    },
    {
      key: "heavy",
      label: "Heavy",
      render: (_v: any, row: any) => `${row.heavy} gram`,
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (_v: any, row: any) => formatNumber(row.quantity || 0),
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, row: StockCurrentData) => {
        if (row.quantity === 0)
          return <span className="text-danger">❌ Habis</span>;
        if (row.quantity < threshold)
          return <span className="text-success">⚠ Menipis</span>;
        return <span className="text-primary">✅ Aman</span>;
      },
    },
  ];

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col bg-white shadow rounded p-4 h-80 overflow-y-auto scrollbar-auto-hide">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Stok Saat Ini</h3>
        </div>
        <MiniTable
          columns={columns}
          data={groupedData}
          page={page}
          totalPages={totalPages}
          totalDataCount={totalDataCount}
          loading={loading}
          emptyMessage="Tidak ada stock saat ini"
          onPageChange={(newPage) => setPage(newPage)}
          className="mt-4"
        />
      </div>
    </div>
  );
}
