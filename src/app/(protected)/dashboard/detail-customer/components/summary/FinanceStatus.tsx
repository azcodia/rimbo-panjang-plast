"use client";

import { formatRp } from "@/lib/formatRp";
import { CustomerSummaryData } from "../../../services/customerDetail/customerSummary";

interface FinanceStatusProps {
  finance: CustomerSummaryData["finance"];
}

export default function FinanceStatus({ finance }: FinanceStatusProps) {
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
      <div className="space-y-1 px-2">
        {financeData.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center px-2 py-1 border-b last:border-b-0"
          >
            <p className="font-semibold leading-relaxed text-xs text-gray-700">
              {item.label}
            </p>
            <p
              className={`font-semibold leading-relaxed text-xs ${
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
