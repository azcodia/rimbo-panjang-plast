"use client";

import DashboardSummary from "./components/DashboardSummary";
import DashboardChart from "./components/DashboardChart";
import RecentTransactions from "./components/RecentTransactions";

export default function DashboardPage() {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return (
    <div className="space-y-8 px-4 py-2">
      <DashboardSummary />
      <DashboardChart
        defaultStartDate={formatDate(priorDate)}
        defaultEndDate={formatDate(today)}
      />
      <RecentTransactions />
    </div>
  );
}
