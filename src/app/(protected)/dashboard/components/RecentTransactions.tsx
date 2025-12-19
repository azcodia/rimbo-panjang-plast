"use client";

import Table, { TableRow } from "@/components/table/Table";
import { formatDate } from "@/lib/formatDate";
import { formatNumber } from "@/lib/formatNumber";
import { useEffect, useState } from "react";
import {
  fetchRecentTransactions,
  RecentTransaction,
} from "../services/recentTransactionService";

export default function RecentTransactions() {
  const [data, setData] = useState<TableRow<RecentTransaction>[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 5;

  const columns = [
    { key: "code", label: "Code" },
    { key: "customer", label: "Customer" },
    {
      key: "input_date",
      label: "Date",
      render: (value: string) => (value ? formatDate(value) : ""),
    },
    { key: "color", label: "Color" },
    {
      key: "size",
      label: "Size",
      render: (_: any, row: any) => `${row.size} cm`,
    },
    {
      key: "heavy",
      label: "Weight",
      render: (_: any, row: any) => `${row.heavy} gram`,
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (_: any, row: any) => formatNumber(row.quantity || 0),
    },
    {
      key: "unit_price",
      label: "Unit Price",
      render: (v: number) => (v ? `Rp ${v.toLocaleString("id-ID")}` : ""),
    },
    {
      key: "discount_per_item",
      label: "Discount",
      render: (v: number) => (v ? `Rp ${v.toLocaleString("id-ID")}` : "Rp 0"),
    },
    {
      key: "total_price",
      label: "Total Price",
      render: (v: number) => (v ? `Rp ${v.toLocaleString("id-ID")}` : ""),
    },
    { key: "note", label: "Note" },
  ];

  const formatGroupedRows = (rows: RecentTransaction[]) => {
    let lastCode = "";

    return rows.map((row) => {
      const isSameCode = row.code === lastCode;
      lastCode = row.code;

      return {
        ...row,
        code: isSameCode ? "" : row.code,
        customer: isSameCode ? "" : row.customer,
        input_date: isSameCode ? "" : row.input_date,
      };
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, total } = await fetchRecentTransactions(page, pageSize);

      const grouped = formatGroupedRows(data);

      setData(grouped.map((item) => ({ data: item })));
      setTotalData(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      console.error("Failed to fetch recent transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Recent Transactions
      </h2>

      <Table
        columns={columns as any}
        data={data}
        page={page}
        totalPages={totalPages}
        totalDataCount={totalData}
        loading={loading}
        onPageChange={setPage}
        emptyMessage="No recent transactions"
      />
    </div>
  );
}
