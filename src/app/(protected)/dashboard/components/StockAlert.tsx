"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  fetchStockAlert,
  StockAlertResponse,
} from "../services/stockAlertService";

import { formatNumber } from "@/lib/formatNumber";
import { threshold } from "@/lib/constanta";

import Button from "@/components/ui/Button";
import MiniTable from "@/components/table/MiniTable";
import LoadingSpinner from "@/components/LoadingSpinner";

type LowStockItem = StockAlertResponse["lowStock"][number];

export default function StockAlert() {
  const router = useRouter();

  const [data, setData] = useState<StockAlertResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalLow, setTotalLow] = useState(0);

  const stockColumns = useMemo(
    () => [
      {
        key: "color",
        label: "Color",
        render: (value: string) => value || "-",
      },
      {
        key: "size",
        label: "Size",
        render: (_: unknown, row: LowStockItem) => `${row.size} cm`,
      },
      {
        key: "heavy",
        label: "Weight",
        render: (_: unknown, row: LowStockItem) => `${row.heavy} gram`,
      },
      {
        key: "stock",
        label: "Stock",
        render: (value: number, row: LowStockItem) => (
          <span className="font-medium text-danger">
            {formatNumber(value)} {row.unit || ""}
          </span>
        ),
      },
    ],
    []
  );

  const fetchAlert = async () => {
    setLoading(true);
    try {
      const result = await fetchStockAlert({ threshold });
      setData(result);
      setTotalLow(result.lowStock.length);
    } catch (error) {
      console.error("Failed to load stock alert:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlert();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white flex items-center justify-center shadow rounded p-4 text-gray-500"
          >
            <LoadingSpinner size={8} color="text-gray-500" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Quick Action */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Quick Action</h3>

        <div className="flex flex-col gap-4">
          <Button
            text="Tambah Pengiriman"
            onClick={() => router.push("/transactions/delivery")}
          />

          <Button
            text="Atur Variasi"
            onClick={() => router.push("/item-arrangement/atribut")}
            className="bg-primary hover:bg-primary-light text-white"
          />

          <Button
            text="Atur Re-Stock"
            onClick={() => router.push("/transactions/re-stock")}
            className="bg-danger hover:bg-danger-light text-white"
          />

          <Button
            text="Tambah Customer"
            onClick={() => router.push("/customers/customer")}
            className="
              text-white font-semibold rounded
              bg-gradient-to-r from-[#2098d5] via-[#7bb927] to-[#2098d5]
              bg-[length:400%_400%] animate-gradient
            "
          />
        </div>
      </div>

      {/* Stock Alert */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Stok Menipis</h3>
          <span className="text-xs bg-red-100 text-danger px-2 py-1 rounded">
            {totalLow} item
          </span>
        </div>

        {data.lowStock.length === 0 ? (
          <p className="text-sm text-success font-semibold">Semua stok aman</p>
        ) : (
          <MiniTable
            columns={stockColumns as any}
            data={data.lowStock.map((item) => ({ data: item }))}
            page={1}
            totalPages={1}
            loading={false}
            emptyMessage="Semua stok aman"
            className="text-sm max-h-60 overflow-y-auto scrollbar-auto-hide"
          />
        )}
      </div>
    </div>
  );
}
