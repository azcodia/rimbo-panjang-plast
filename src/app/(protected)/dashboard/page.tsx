"use client";

import PageContainer from "@/components/PageContainer";
import DashboardChart from "./components/DashboardChart/page";
import DashboardSummary from "./components/DashboardSummary/page";
import Inventory from "./components/Inventories/page";
import RecentTransactions from "./components/RecentTransactions/page";
import TopHighlights from "./components/TopHighlights/page";

export default function DashboardPage() {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return (
    <PageContainer title="Dashboard">
      <DashboardSummary />
      <Inventory />
      <TopHighlights />
      <DashboardChart
        defaultStartDate={formatDate(priorDate)}
        defaultEndDate={formatDate(today)}
      />
      <RecentTransactions />
    </PageContainer>
  );
}
