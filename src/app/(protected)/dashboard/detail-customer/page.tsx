"use client";

import { useSearchParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import CustomerSummaryLayout from "./CustomerSummaryLayout";
import CustomerTransactionHistory from "@/app/(protected)/dashboard/detail-customer/CustomerTransactionHistory";

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

  return (
    <PageContainer title={`Pelanggan: ${customerName ?? "-"}`}>
      <CustomerSummaryLayout customerId={customerId} />
      <CustomerTransactionHistory customerId={customerId} />
    </PageContainer>
  );
}
