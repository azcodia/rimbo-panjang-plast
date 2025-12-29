"use client";

import { useEffect, useMemo, useState } from "react";
import MiniTable from "@/components/table/MiniTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatNumber } from "@/lib/formatNumber";

import { fetchTopSelling } from "../../services/topSelling.service";
import { groupAndSortStock } from "@/lib/groupedStock";
import { formatWeight } from "@/lib/formatWeight";

export interface TopSellingItem {
  color_id: string;
  color: string;
  size: string | number;
  heavy: string | number;
  total_qty: number;
  total_transactions: number;
}

export default function TopProducts() {
  const [items, setItems] = useState<TopSellingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const pageSize = 5;

  const loadTopSelling = async () => {
    setLoading(true);
    try {
      const result = await fetchTopSelling(page, pageSize);
      setItems(result.data as any);
      setTotalDataCount(result.total);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error("Failed to fetch top selling:", error);
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => groupAndSortStock(items), [items]);

  useEffect(() => {
    loadTopSelling();
  }, []);

  const columns = useMemo(
    () => [
      { key: "color", label: "Warna" },
      {
        key: "size",
        label: "Ukuran",
        render: (_: unknown, row: TopSellingItem) => `${row.size} cm`,
      },
      {
        key: "heavy",
        label: "Berat",
        render: (_: unknown, row: TopSellingItem) => `${row.heavy} gram`,
      },
      {
        key: "total_qty_pcs",
        label: "Terjual",
        render: (_: unknown, row: TopSellingItem) =>
          `${formatNumber(row.total_qty)} Pcs`,
      },
      {
        key: "total_qty_weight",
        label: "Total Berat",
        render: (_: unknown, row: TopSellingItem) =>
          formatWeight(row.total_qty, row.heavy),
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
        <h3 className="text-lg font-semibold">5 Produk Terpopuler</h3>
      </div>

      <MiniTable
        columns={columns as any}
        data={tableData}
        page={page}
        totalPages={totalPages}
        totalDataCount={totalDataCount}
        loading={false}
        emptyMessage="Belum ada penjualan"
        onPageChange={setPage}
        className="mt-4"
      />
    </div>
  );
}
