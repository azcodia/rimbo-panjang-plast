"use client";

import { useState, useMemo } from "react";
import MiniTable from "@/components/table/MiniTable";
import { CustomerTransactionItem } from "../services/customerDetail/customerTransactionHistory";
import { TableRow } from "@/components/table/Table";
import { formatRp } from "@/lib/formatRp";
import { formatNumber } from "@/lib/formatNumber";
import { formatDate } from "@/lib/formatDate";
import { useCustomerTransactionHistory } from "./hooks/useCustomerTransactionHistory";

interface Props {
  customerId: string | null;
}

export default function CustomerTransactionHistory({ customerId }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);
  const Dates = (d: Date) => d.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(Dates(priorDate));
  const [endDate, setEndDate] = useState(Dates(today));

  const { data, grandTotal, totalPages, loading, error } =
    useCustomerTransactionHistory({
      customerId,
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

  const columns = useMemo(
    () => [
      {
        key: "date",
        label: "Tanggal Transaksi",
        render: (_: unknown, row: CustomerTransactionItem) =>
          row?.date ? formatDate(row.date) : "",
      },
      {
        key: "code",
        label: "Kode Transaksi",
        render: (_: unknown, row: CustomerTransactionItem) => row?.code ?? "-",
      },
      {
        key: "itemDetail",
        label: "Item Detail",
        render: (_: unknown, row: CustomerTransactionItem) =>
          row?.itemDetail ?? "-",
      },
      {
        key: "quantity",
        label: "Quantity",
        render: (_: unknown, row: CustomerTransactionItem) =>
          formatNumber(row.quantity ?? 0),
      },
      {
        key: "unit_price",
        label: "Harga/unit",
        render: (_: unknown, row: CustomerTransactionItem) =>
          formatRp(row.unit_price),
      },
      {
        key: "discount_per_item",
        label: "Potongan Harga",
        render: (_: unknown, row: CustomerTransactionItem) =>
          formatRp(row.discount_per_item),
      },
      {
        key: "total_price",
        label: "Total Harga",
        render: (_: unknown, row: CustomerTransactionItem) =>
          formatRp(row.total_price),
      },
    ],
    []
  );

  const groupedData: TableRow<CustomerTransactionItem>[] = useMemo(() => {
    const map = new Map<string, boolean>();
    return data.map((item) => {
      const dateKey = item.date || "";
      const key = `${dateKey}|${item.code}`;
      const isFirst = !map.has(key);
      map.set(key, true);

      return {
        data: {
          ...item,
          code: isFirst ? item.code : "",
          date: isFirst ? dateKey : "",
        },
      };
    });
  }, [data]);

  return (
    <div className="rounded-md border bg-white py-2.5 px-4 shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-2">
        Riwayat Transaksi Pembelian
      </h2>

      <div className="flex gap-2 mb-3">
        {[
          { label: "Dari Tanggal", type: "start", value: startDate },
          { label: "Sampai Tanggal", type: "end", value: endDate },
        ].map(({ label, type, value }) => (
          <div key={type}>
            <label className="block text-xs font-medium mb-0.5">{label}</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={value || ""}
              onChange={(e) =>
                handleDateChange(type as "start" | "end", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <MiniTable
        columns={columns}
        data={groupedData}
        page={page}
        totalPages={totalPages}
        totalDataCount={data.length}
        loading={loading}
        emptyMessage="Tidak ada data"
        onPageChange={setPage}
        className="mt-4"
      />

      <div className="mt-4 text-right font-semibold">
        Grand Total Periode: {formatRp(grandTotal)}
      </div>
    </div>
  );
}
