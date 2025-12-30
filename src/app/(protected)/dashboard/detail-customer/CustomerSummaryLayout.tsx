"use client";

import { useCustomerSummary } from "./hooks/useCustomerSummary";
import { useCustomerPurchaseSummary } from "./hooks/useCustomerPurchaseSummary";
import LeftPanelSummary from "./components/summary/LeftPanelSummary";
import RightPanelSummary from "./components/summary/RightPanelSummary";

interface Props {
  customerId: string | null;
}

export default function CustomerSummaryLayout({ customerId }: Props) {
  const summaryState = useCustomerSummary(customerId);
  const purchaseState = useCustomerPurchaseSummary(customerId);

  if (!customerId) return null;

  return (
    <div className="grid grid-cols-11 gap-2">
      <LeftPanelSummary
        summary={summaryState.data}
        loading={summaryState.loading}
        error={summaryState.error}
      />

      <RightPanelSummary
        customerId={customerId}
        purchase={purchaseState.data}
        loading={purchaseState.loading}
      />
    </div>
  );
}
