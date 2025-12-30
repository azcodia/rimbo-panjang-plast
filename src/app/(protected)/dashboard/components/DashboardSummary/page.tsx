"use client";
import SummaryCard from "@/components/cards/summaryCard";
import { formatRp } from "@/lib/formatRp";
import { useEffect, useState } from "react";
import { fetchSummary } from "../../services/summaryService";
import { formatNumber } from "@/lib/formatNumber";
import { formatWeight } from "@/lib/formatWeight";

interface SummaryTransaction {
  total_qty: number;
  total_transactions: number;
}

interface SummarySales {
  total_amount: number;
  total_transactions: number;
}

interface SummaryReceivable {
  total: number;
  unpaid_deliveries: number;
}

interface SummaryData {
  restock: SummaryTransaction;
  delivery: SummaryTransaction;
  sales: SummarySales;
  receivable: SummaryReceivable;
  total_weight_gram: number;
}

export default function DashboardSummary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat ringkasan...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-5 gap-2">
      <SummaryCard
        title="Total Restok"
        value={`${formatNumber(data.restock.total_qty)} Pcs`}
        subtitle={`${data.restock.total_transactions} transaksi`}
      />
      <SummaryCard
        title="Penjualan Per Pcs"
        value={`${formatNumber(data.delivery.total_qty)} Pcs`}
        subtitle={`${data.delivery.total_transactions} transaksi`}
      />
      <SummaryCard
        title="Total Berat"
        value={formatWeight(data.total_weight_gram, 1)}
      />
      <SummaryCard
        title="Total Pembayaran"
        value={formatRp(data.sales.total_amount, { format: "short" })}
      />
      <SummaryCard
        title="Total Hutang"
        value={formatRp(data.receivable.total, { format: "short" })}
        subtitle={`${data.receivable.unpaid_deliveries} belum lunas`}
      />
    </div>
  );
}
