"use client";

import DashboardChart from "./components/DashboardChart/page";
import DashboardSummary from "./components/DashboardSummary/page";
import RecentTransactions from "./components/RecentTransactions/page";
import StockAlert from "./components/StockAlert/page";
import StockCurrent from "./components/StockCurrent/page";

export default function DashboardPage() {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return (
    <div className="space-y-8 px-4 py-2">
      <DashboardSummary />
      <StockAlert />
      <StockCurrent />
      <DashboardChart
        defaultStartDate={formatDate(priorDate)}
        defaultEndDate={formatDate(today)}
      />
      <RecentTransactions />
    </div>
  );
}
