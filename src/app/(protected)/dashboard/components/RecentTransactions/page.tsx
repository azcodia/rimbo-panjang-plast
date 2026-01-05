"use client";

import { useState, useMemo } from "react";
import MiniTable from "@/components/table/MiniTable";
import { TableRow } from "@/components/table/Table";
import { formatRp } from "@/lib/formatRp";
import { formatNumber } from "@/lib/formatNumber";
import { formatDate } from "@/lib/formatDate";
import { formatWeight } from "@/lib/formatWeight";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import { Eye } from "lucide-react";
import { useDashboardTransactions } from "../../detail-customer/hooks/useDashboardTransactions";
import { DashboardTransactionItem } from "../../services/recentTransactionService";

export default function DashboardTransactionHistory() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);
  const Dates = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(Dates(priorDate));
  const [endDate, setEndDate] = useState(Dates(today));
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [isModalPaidOpen, setIsModalPaidOpen] = useState(false);

  const { data, grandTotal, grandTotalWeight, totalPages, loading, error } =
    useDashboardTransactions({
      page,
      pageSize,
      startDate,
      endDate,
    });

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") setStartDate(value);
    if (type === "end") setEndDate(value);
    setPage(1);
  };

  type DashboardTransactionRow = DashboardTransactionItem & {
    __isFirst: boolean;
  };
  const columns = useMemo(
    () => [
      {
        key: "actions",
        label: "Actions",
        render: (_: unknown, row: { __isFirst: boolean; deliveryId: string }) =>
          row.__isFirst ? (
            <button
              title="Detail"
              onClick={() => {
                setSelectedDelivery(row.deliveryId);
                setIsModalPaidOpen(true);
              }}
              className="text-gray-700 hover:opacity-70 transition-colors"
            >
              <Eye strokeWidth={2.2} size={16} />
            </button>
          ) : null,
      },
      {
        key: "date",
        label: "Tanggal",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.__isFirst ? formatDate(row.date) : "",
      },
      {
        key: "code",
        label: "Kode",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.__isFirst ? row.code : "",
      },
      {
        key: "customerName",
        label: "Customer",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.__isFirst ? row.customerName : "",
      },
      {
        key: "status",
        label: "Status",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.__isFirst ? <PaymentStatusBadge status={row.status} /> : "",
      },
      {
        key: "totalWeightAllItems",
        label: "Total Berat",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.__isFirst ? formatWeight(row.totalWeightAllItems, 1) : "",
      },
      {
        key: "totalPaid",
        label: "Dibayar",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.__isFirst ? formatRp(row.totalPaid) : "",
      },
      {
        key: "remaining",
        label: "Sisa",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.__isFirst ? formatRp(row.remaining) : "",
      },
      {
        key: "itemDetail",
        label: "Item",
        render: (_: unknown, row: DashboardTransactionRow) =>
          row.itemDetail ?? "-",
      },
      {
        key: "quantity",
        label: "Qty",
        render: (_: unknown, row: DashboardTransactionRow) =>
          formatNumber(row.quantity),
      },
      {
        key: "totalWeight",
        label: "Berat",
        render: (_: unknown, row: DashboardTransactionRow) =>
          formatWeight(row.totalWeight, 1),
      },
      {
        key: "unit_price",
        label: "Harga",
        render: (_: unknown, row: DashboardTransactionRow) =>
          formatRp(row.unit_price),
      },
      {
        key: "discount_per_item",
        label: "Diskon",
        render: (_: unknown, row: DashboardTransactionRow) =>
          formatRp(row.discount_per_item),
      },
      {
        key: "total_price",
        label: "Total",
        render: (_: unknown, row: DashboardTransactionRow) =>
          formatRp(row.total_price),
      },
    ],
    []
  );

  const groupedData: TableRow<
    DashboardTransactionItem & { __isFirst: boolean }
  >[] = useMemo(() => {
    const seen = new Set<string>();

    return data.map((item) => {
      const isFirst = !seen.has(item.deliveryId);
      seen.add(item.deliveryId);

      return {
        data: {
          ...item,
          __isFirst: isFirst,

          code: isFirst ? item.code : "",
          date: isFirst ? item.date : "",
          customerName: isFirst ? item.customerName : "",
          status: isFirst ? item.status : item.status,
          totalPaid: isFirst ? item.totalPaid : 0,
          remaining: isFirst ? item.remaining : 0,
          totalWeightAllItems: isFirst ? item.totalWeightAllItems : 0,
        },
      };
    });
  }, [data]);

  return (
    <div className="rounded-md border bg-white py-2.5 px-4 shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-2">Semua Transaksi Penjualan</h2>

      <div className="flex justify-between">
        <div className="flex gap-6">
          <div className="border rounded-md p-3 text-right shadow-sm">
            <p className="text-sm text-gray-600">Grand Total</p>
            <p className="font-semibold">{formatRp(grandTotal)}</p>
          </div>
          <div className="border rounded-md p-3 text-right shadow-sm">
            <p className="text-sm text-gray-600">Grand Total Berat</p>
            <p className="font-semibold">{formatWeight(grandTotalWeight, 1)}</p>
          </div>
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

      <div className="h-[28rem] overflow-y-auto scrollbar-auto-hide">
        <MiniTable
          columns={columns as any}
          data={groupedData}
          page={page}
          totalPages={totalPages}
          totalDataCount={totalPages * pageSize}
          loading={loading}
          emptyMessage="Tidak ada data"
          onPageChange={setPage}
          className="mt-4"
          isPagination={false}
        />
      </div>
    </div>
  );
}
