import SummaryCard from "@/components/cards/summaryCard";
import PaymentChart from "../customer/PaymentChart";
import { CustomerPurchaseSummaryData } from "../../../services/customerDetail/customerPurchaseSummary";
import { formatNumber } from "@/lib/formatNumber";
import { formatWeight } from "@/lib/formatWeight";
import { formatRp } from "@/lib/formatRp";

interface Props {
  customerId: string;
  purchase: CustomerPurchaseSummaryData | null;
  loading: boolean;
}

export default function RightPanelSummary({
  customerId,
  purchase,
  loading,
}: Props) {
  return (
    <div className="col-span-8">
      <div className="grid grid-cols-4 gap-2 mb-4">
        <SummaryCard
          title="Total Transaksi"
          value={formatNumber(purchase?.total_transactions || 0)}
          loading={loading}
        />
        <SummaryCard
          title="Total Unit"
          value={formatNumber(purchase?.total_quantity || 0)}
          loading={loading}
        />
        <SummaryCard
          title="Total Berat"
          value={formatWeight(purchase?.total_weight ?? 0, 1)}
          loading={loading}
        />
        <SummaryCard
          title="Total Pembelian"
          value={formatRp(purchase?.total_amount || 0, {
            format: "short",
          })}
          loading={loading}
        />
      </div>

      <div className="rounded-lg min-h-[300px] border bg-white">
        <PaymentChart customerId={customerId} />
      </div>
    </div>
  );
}
