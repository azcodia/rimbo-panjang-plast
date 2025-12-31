"use client";

import { useSearchParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import CustomerSummaryLayout from "./CustomerSummaryLayout";
import Tabs, { TabItem } from "@/components/tabs/Tabs";
import dynamic from "next/dynamic";
import { ChartSpline, Table } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const PaymentChartCustomer = dynamic(
  () =>
    import(
      "@/app/(protected)/dashboard/detail-customer/components/customer/PaymentChart"
    ).then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

const PaymentTableCustomer = dynamic(
  () =>
    import(
      "@/app/(protected)/dashboard/detail-customer/CustomerTransactionHistory"
    ).then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function DetailCustomerPage() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const customerName = searchParams.get("customerName");

  if (!customerId) {
    return (
      <PageContainer title="Pelanggan">
        <div className="p-6 text-sm text-gray-500">
          Customer ID tidak ditemukan
        </div>
      </PageContainer>
    );
  }

  const tabs: TabItem[] = [
    {
      id: "table",
      label: "Table Transaksi",
      icon: <Table size={18} strokeWidth={2} />,
      content: <PaymentTableCustomer customerId={customerId} />,
    },
    {
      id: "payment",
      label: "Grafik Pembayaran",
      icon: <ChartSpline size={18} strokeWidth={2} />,
      content: <PaymentChartCustomer customerId={customerId} />,
    },
  ];

  return (
    <PageContainer title={`Pelanggan: ${customerName ?? "-"}`}>
      <CustomerSummaryLayout customerId={customerId} />
      <Tabs tabs={tabs} defaultTabId="table" />
    </PageContainer>
  );
}
