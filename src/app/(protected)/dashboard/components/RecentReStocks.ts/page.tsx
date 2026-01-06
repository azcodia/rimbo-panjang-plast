"use client";

import { useState, useMemo } from "react";
import MiniTable from "@/components/table/MiniTable";
import { TableRow } from "@/components/table/Table";
import { formatNumber } from "@/lib/formatNumber";
import { formatDate } from "@/lib/formatDate";
import { formatWeight } from "@/lib/formatWeight";
import SummaryCard from "@/components/cards/summaryCard";
import { useDashboardRestocks } from "../../detail-customer/hooks/useDashboardRestocks";
import { DashboardRestockItem } from "../../services/recentReStockService";

export default function DashboardRestockHistory() {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);
  const Dates = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(Dates(priorDate));
  const [endDate, setEndDate] = useState(Dates(today));

  const { data, grandTotalQty, grandTotalWeight, loading, error } =
    useDashboardRestocks({
      startDate,
      endDate,
    });

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") setStartDate(value);
    if (type === "end") setEndDate(value);
  };

  type DashboardRestockRow = DashboardRestockItem & {
    __isFirst: boolean;
  };

  const columns = useMemo(
    () => [
      {
        key: "date",
        label: "Tanggal",
        render: (_: unknown, row: DashboardRestockRow) =>
          row.__isFirst ? formatDate(row.date) : "",
      },
      {
        key: "code",
        label: "Kode Restock",
        render: (_: unknown, row: DashboardRestockRow) =>
          row.__isFirst ? row.code : "",
      },
      {
        key: "itemDetail",
        label: "Item",
      },
      {
        key: "quantity",
        label: "Qty",
        render: (_: unknown, row: DashboardRestockRow) =>
          `${formatNumber(row.quantity)} pcs`,
      },
      {
        key: "totalWeight",
        label: "Total Berat",
        render: (_: unknown, row: DashboardRestockRow) =>
          formatWeight(row.totalWeight, 1),
      },
      {
        key: "totalWeightAllItems",
        label: "Total Berat Keseluruhan",
        render: (_: unknown, row: DashboardRestockRow) =>
          row.__isFirst ? formatWeight(row.totalWeightAllItems, 1) : "",
      },
    ],
    []
  );

  const groupedData: TableRow<DashboardRestockRow>[] = useMemo(() => {
    const seen = new Set<string>();

    return data.map((item) => {
      const isFirst = !seen.has(item.restockId);
      seen.add(item.restockId);

      return {
        data: {
          ...item,
          __isFirst: isFirst,

          code: isFirst ? item.code : "",
          date: isFirst ? item.date : "",
        },
      };
    });
  }, [data]);

  return (
    <div className="rounded-md border bg-white py-2.5 px-4 shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-2">Riwayat Restock Barang</h2>

      <div className="flex justify-between mb-3">
        <div className="flex gap-2">
          <SummaryCard title="Total Qty" value={formatNumber(grandTotalQty)} />
          <SummaryCard
            title="Total Berat"
            value={formatWeight(grandTotalWeight, 1)}
          />
        </div>

        <div className="flex gap-2 mb-3">
          {[
            { label: "Dari", type: "start", value: startDate },
            { label: "Sampai", type: "end", value: endDate },
          ].map(({ label, type, value }) => (
            <div key={type}>
              <label className="block text-xs font-medium mb-0.5">
                {label}
              </label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={value}
                onChange={(e) =>
                  handleDateChange(type as "start" | "end", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="h-[24.5rem] overflow-y-auto scrollbar-auto-hide">
        <MiniTable
          columns={columns as any}
          data={groupedData}
          page={0}
          totalPages={0}
          totalDataCount={groupedData.length}
          loading={loading}
          emptyMessage="Tidak ada data restock"
          isPagination={false}
        />
      </div>
    </div>
  );
}
