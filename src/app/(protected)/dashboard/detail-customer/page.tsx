"use client";

import PageContainer from "@/components/PageContainer";
import { useSearchParams } from "next/navigation";
import CustomerSummaryLayout from "./CustomerSummaryLayout";

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
