import { useEffect, useMemo, useState } from "react";
import {
  fetchStockAlert,
  StockAlertResponse,
} from "../../services/stockAlertService";
import { threshold } from "@/lib/constanta";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatNumber } from "@/lib/formatNumber";
import MiniTable from "@/components/table/MiniTable";

type LowStockItem = StockAlertResponse["lowStock"][number];

export default function LowStock() {
  const [data, setData] = useState<StockAlertResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalLow, setTotalLow] = useState(0);

  const stockColumns = useMemo(
    () => [
      {
        key: "color",
        label: "Warna",
        render: (value: string) => value || "-",
      },
      {
        key: "size",
        label: "Ukuran",
        render: (_: unknown, row: LowStockItem) => `${row.size} cm`,
      },
      {
        key: "heavy",
        label: "Berat",
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
      <div className="bg-white flex items-center justify-center shadow rounded p-4 text-gray-500 h-80">
        <LoadingSpinner size={8} color="text-gray-500" />
      </div>
    );
  }

  if (!data) return null;

  return (
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
  );
}
