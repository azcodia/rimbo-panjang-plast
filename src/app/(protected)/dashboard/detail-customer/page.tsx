"use client";

import { useSearchParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import CustomerSummaryLayout from "./CustomerSummaryLayout";
import CustomerTransactionHistory from "./CustomerTransactionHistory";

export default function DetailCustomerPage() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const customerName = searchParams.get("customerName");

  return (
    <PageContainer title={`Pelanggan: ${customerName}`}>
      <CustomerSummaryLayout customerId={customerId} />
      <CustomerTransactionHistory customerId={customerId} />
    </PageContainer>
  );
}
