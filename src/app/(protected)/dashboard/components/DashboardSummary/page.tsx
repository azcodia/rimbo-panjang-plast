"use client";
import SummaryCard from "@/components/cards/summaryCard";
import { formatRp } from "@/lib/formatRp";
import { useEffect, useState } from "react";
import { fetchSummary } from "../../services/summaryService";
import { formatNumber } from "@/lib/formatNumber";

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
    <div className="grid grid-cols-4 gap-4">
      <SummaryCard
        title="Total Restok"
        value={formatNumber(data.restock.total_qty)}
        subtitle={`${data.restock.total_transactions} transaksi`}
      />
      <SummaryCard
        title="Total Pengiriman"
        value={formatNumber(data.delivery.total_qty)}
        subtitle={`${data.delivery.total_transactions} transaksi`}
      />
      <SummaryCard
        title="Total Pembayaran"
        value={formatRp(data.sales.total_amount)}
      />
      <SummaryCard
        title="Total Hutang"
        value={formatRp(data.receivable.total)}
        subtitle={`${data.receivable.unpaid_deliveries} belum lunas`}
      />
    </div>
  );
}
