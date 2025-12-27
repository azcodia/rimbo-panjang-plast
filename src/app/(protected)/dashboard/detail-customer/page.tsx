"use client";

import PageContainer from "@/components/PageContainer";
import CustomerSummaryLayout from "./components/summary/CustomerSummaryLayout";
import { useSearchParams } from "next/navigation";

export default function DetailCustomerPage() {
  const searchParams = useSearchParams();
  const customerName = searchParams.get("customerName");
  return (
    <PageContainer
      title={customerName ? `Pelanggan: ${customerName}` : "Detail Pelanggan"}
    >
      <CustomerSummaryLayout />
    </PageContainer>
  );
}
