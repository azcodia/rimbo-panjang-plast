"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { formatRp } from "@/lib/formatRp";
import { CustomerSummaryData } from "../../../services/customerDetail/customerSummary";

interface FinanceStatusProps {
  loading: boolean;
  error: string | null;
  finance?: CustomerSummaryData["finance"];
}

export default function FinanceStatus({
  loading,
  error,
  finance,
}: FinanceStatusProps) {
  if (loading)
    return (
      <div className="flex justify-center items-center h-44 rounded-md border bg-white">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-center text-red-500 rounded-md border bg-white">
        {error}
      </div>
    );

  if (!finance)
    return (
      <div className="p-4 text-center rounded-md border bg-white">
        No data found
      </div>
    );

  const financeData = [
    { label: "Total Tagihan", value: finance.total_tagihan },
    { label: "Total Dibayar", value: finance.total_dibayar },
    { label: "Sisa Piutang", value: finance.sisa_piutang },
    { label: "Invoice Pending", value: finance.total_invoice_pending },
  ];

  return (
    <div className="rounded-md border bg-white py-2.5 shadow-sm">
      <div className="py-1.5 px-4 flex items-center border-b-[1px] mb-2">
        <h3 className="text-base font-semibold">Status Keuangan</h3>
      </div>

      <div className="flex flex-col gap-4 text-sm px-2">
        {financeData.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center px-2 py-1 border-b last:border-b-0"
          >
            <p className="font-semibold text-xs text-gray-700">{item.label}</p>
            <p
              className={`font-semibold text-xs ${
                item.label === "Sisa Piutang"
                  ? "text-success-light"
                  : "text-gray-900"
              }`}
            >
              {item.label !== "Invoice Pending"
                ? formatRp(item.value as number)
                : `${item.value} Invoice`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
