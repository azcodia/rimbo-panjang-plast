import CustomerInfo from "./CustomerInfo";
import FinanceStatus from "./FinanceStatus";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatDate } from "@/lib/formatDate";
import { CustomerSummaryData } from "../../../services/customerDetail/customerSummary";

interface Props {
  summary: CustomerSummaryData | null;
  loading: boolean;
  error: string | null;
}

export default function LeftPanelSummary({ summary, loading, error }: Props) {
  return (
    <div className="col-span-3 flex flex-col gap-2">
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

      {loading ? (
        <div className="flex h-12 justify-center items-center rounded-md border px-4 bg-white shadow-sm">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex justify-between items-center rounded-md border px-4 bg-white py-[0.960rem] shadow-sm">
          <p className="font-semibold text-xs text-gray-700">
            Transaksi Terakhir
          </p>
          <span className="font-bold text-xs text-success-light">
            {formatDate(summary?.insights.last_transaction_date || undefined)}
          </span>
        </div>
      )}
    </div>
  );
}
