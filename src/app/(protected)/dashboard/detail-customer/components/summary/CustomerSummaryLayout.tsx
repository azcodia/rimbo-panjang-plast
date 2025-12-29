"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CustomerSummaryData,
  fetchCustomerSummary,
} from "../../../services/customerDetail/customerSummary";
import CustomerInfo from "./CustomerInfo";
import FinanceStatus from "./FinanceStatus";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CustomerSummaryLayout() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");

  const [summary, setSummary] = useState<CustomerSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchCustomerSummary(customerId);
        setSummary(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load customer summary");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [customerId]);

  return (
    <div className="grid grid-cols-11 gap-4">
      <div className="col-span-3 flex flex-col gap-4">
        <CustomerInfo
          loading={loading}
          error={error}
          customer={summary?.customer}
        />

        <FinanceStatus
          loading={loading}
          error={error}
          finance={summary?.finance}
        />
      </div>

      <div className="col-span-8 bg-red-900">Right</div>
    </div>
  );
}
