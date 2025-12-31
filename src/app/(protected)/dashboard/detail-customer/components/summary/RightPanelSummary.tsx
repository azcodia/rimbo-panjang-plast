import SummaryCard from "@/components/cards/summaryCard";
import { CustomerPurchaseSummaryData } from "../../../services/customerDetail/customerPurchaseSummary";
import { formatNumber } from "@/lib/formatNumber";
import { formatWeight } from "@/lib/formatWeight";
import { formatRp } from "@/lib/formatRp";
import Tabs, { TabItem } from "@/components/tabs/Tabs";
import { Palette } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import dynamic from "next/dynamic";

interface Props {
  customerId: string;
  purchase: CustomerPurchaseSummaryData | null;
  loading: boolean;
}

const ColorChartCustomer = dynamic(
  () =>
    import(
      "@/app/(protected)/dashboard/detail-customer/components/demand/CustomerColorChart"
    ).then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function RightPanelSummary({
  customerId,
  purchase,
  loading,
}: Props) {
  const tabs: TabItem[] = [
    {
      id: "color",
      label: "Tren Grafik Warna",
      icon: <Palette size={18} strokeWidth={2} />,
      content: <ColorChartCustomer customerId={customerId} />,
    },
  ];

  return (
    <div className="col-span-8">
      <div className="grid grid-cols-4 gap-2 mb-2">
        <SummaryCard
          title="Total Transaksi"
          value={formatNumber(purchase?.total_transactions || 0)}
          loading={loading}
        />
        <SummaryCard
          title="Pembelian Unit"
          value={`${formatNumber(purchase?.total_quantity || 0)} Pcs`}
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

      <div className="rounded-lg  border bg-white">
        <Tabs tabs={tabs} defaultTabId="color" />
      </div>
    </div>
  );
}
