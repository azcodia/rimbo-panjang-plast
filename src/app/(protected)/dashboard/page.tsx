"use client";

import SummaryCard from "@/components/cards/summaryCard";
import { formatNumber } from "@/lib/formatNumber";
import { formatRp } from "@/lib/formatRp";
import { useEffect, useState } from "react";

// === INTERFACE ===
interface SummaryTransaction {
  total_qty: number;
  total_transactions: number;
}

interface SummarySales {
  total_amount: number;
  total_transactions: number;
}

interface SummaryData {
  total_stock: number;
  restock: SummaryTransaction;
  delivery: SummaryTransaction;
  sales: SummarySales;
}

export default function DashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/dashboards/dashboard/summary");
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Failed to load summary");
        }

        setData(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // === HANDLING LOADING & ERROR ===
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-8 px-4 py-2">
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          title="Total Stock"
          value={formatNumber(data.total_stock)}
        />

        <SummaryCard
          title="Total Restock"
          value={formatNumber(data.restock.total_qty)}
          subtitle={`${data.restock.total_transactions} transaksi`}
        />

        <SummaryCard
          title="Total Delivery"
          value={formatNumber(data.delivery.total_qty)}
          subtitle={`${data.delivery.total_transactions} transaksi`}
        />

        <SummaryCard
          title="Total Penjualan"
          value={formatRp(data.sales.total_amount)}
        />
      </div>
    </div>
  );
}
