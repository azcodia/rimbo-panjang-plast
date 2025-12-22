"use client";

import CurrencyInput from "@/components/ui/CurrencyInput";
import Input from "@/components/ui/Input";
import BaseModal from "@/components/ui/modals/modal";
import { usePaidByCode } from "@/hooks/usePaidByCode";
import { useEffect } from "react";

interface AddPaidModalProps {
  isOpen: boolean;
  deliveryCode: string;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
}

export default function AddPaidModal({
  isOpen,
  deliveryCode,
  onClose,
  onSaved,
  size = "sm",
}: AddPaidModalProps) {
  const { pageSize, summary, fetchDelivery, fetchSummary } =
    usePaidByCode(deliveryCode);

  useEffect(() => {
    fetchDelivery(1, pageSize);
    fetchSummary();
  }, [deliveryCode]);

  return (
    <BaseModal
      title="Tambah Pembayaran"
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <div className="flex flex-col h-[28.4rem] overflow-y-auto scrollbar-auto-hide">
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
            <CurrencyInput
              label="Total Harga"
              value={summary?.total_price || 0}
              onChange={() => undefined}
              disabled={true}
            />
            <CurrencyInput
              label="Total Bayar"
              value={summary?.total_payment || 0}
              onChange={() => undefined}
              disabled={true}
            />
            <CurrencyInput
              label="Sisa Pembayaran"
              value={
                (summary?.total_price ?? 0) - (summary?.total_payment ?? 0)
              }
              onChange={() => undefined}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
