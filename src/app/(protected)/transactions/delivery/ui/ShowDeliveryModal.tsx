import TableWithControls from "@/components/table/TableWithControls";
import CurrencyInput from "@/components/ui/CurrencyInput";
import Input from "@/components/ui/Input";
import BaseModal from "@/components/ui/modals/modal";
import Textarea from "@/components/ui/Textarea";
import ThousandInput from "@/components/ui/ThousandInput";
import { useDeliveryByCode } from "@/hooks/useDeliveryByCode";
import { formatDate } from "@/lib/formatDate";
import { formatWeight } from "@/lib/formatWeight";
import { useEffect } from "react";

interface ShowDetailDeliveryProps {
  isOpen: boolean;
  deliveryCode: string;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}

export interface DeliveryItem {
  color: string;
  size: number | null;
  weight: number | null;
  quantity: number;
  unit_price: number;
  discount_per_item: number;
  total_price: number;
  tokenHistory: string;
}

export default function ShowDetailDeliveryModal({
  isOpen,
  deliveryCode,
  onClose,
  // onSaved,
  size,
}: ShowDetailDeliveryProps) {
  const {
    columns,
    data,
    loading,
    page,
    pageSize,
    total,
    summary,
    setPage,
    fetchSummary,
    fetchDelivery,
  } = useDeliveryByCode(deliveryCode);

  useEffect(() => {
    fetchDelivery(1, pageSize);
    fetchSummary();
  }, [deliveryCode]);

  return (
    <BaseModal
      title="Detail Delivery"
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-[28.3rem] overflow-y-auto scrollbar-auto-hide flex flex-col rounded-md border bg-white p-4 shadow-sm gap-4">
            <Input
              label="No Transaksi"
              value={summary?.code || ""}
              onChange={() => undefined}
              disabled={true}
            />
            <Input
              label="Nama Pelanggan"
              value={summary?.customer_name || ""}
              onChange={() => undefined}
              disabled={true}
            />
            <Input
              label="Tanggal Transaksi"
              value={formatDate(summary?.input_date) || ""}
              onChange={() => undefined}
              disabled={true}
            />
            <ThousandInput
              label="Total Item"
              value={summary?.total_items || 0}
              onChange={() => undefined}
              disabled={true}
            />
            <Input
              label="Total Berat"
              value={formatWeight(summary?.total_weight ?? 0, 1)}
              onChange={() => undefined}
              disabled={true}
            />
            <Input
              label="Catatan"
              value={formatDate(summary?.note) || ""}
              onChange={() => undefined}
              disabled={true}
            />
            <Textarea
              label="Keterangan"
              value={summary?.description || ""}
              onChange={() => undefined}
              disabled={true}
            />
            <CurrencyInput
              label="Total Harga"
              value={summary?.total_price || 0}
              onChange={() => undefined}
              disabled={true}
            />
          </div>
          <div className="col-span-2">
            <TableWithControls
              columns={columns as any}
              data={data}
              total={total}
              page={page}
              totalPages={Math.ceil(total / pageSize)}
              loading={loading}
              onPageChange={(newPage) => {
                setPage(newPage);
                fetchDelivery(newPage, pageSize);
              }}
              showSearch={false}
              visibleActions={[]}
              filterValue={""}
              onFilterChange={() => undefined}
              onActionClick={() => undefined}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
