"use client";

import { useCallback, useEffect } from "react";
import BaseModal from "@/components/ui/modals/modal";
import { usePaidByCode } from "@/hooks/usePaidByCode";
import PaidForm, { PaidFormValues } from "../components/PaidForm";
import PaymentList from "../components/PaymentList";

export default function AddPaidModal({
  isOpen,
  deliveryCode,
  onClose,
  onSaved,
  size = "sm",
}: any) {
  const {
    pageSize,
    summary,
    payments,
    fetchDeliveryByCode,
    fetchSummaryByCode,
    fetchPaymentsByCode,
  } = usePaidByCode(deliveryCode);

  useEffect(() => {
    fetchDeliveryByCode(1, pageSize);
    fetchSummaryByCode();
    fetchPaymentsByCode();
  }, [pageSize]);

  const initialValues: PaidFormValues = {
    delivery_id: summary?.delivery_id || "",
    bank_id: "",
    amount: 0,
    note: "",
    code: summary?.code || "",
    customer_name: summary?.customer_name || "",
    total_price: summary?.total_price || 0,
    total_payment: summary?.total_payment || 0,
    remaining_payment:
      (summary?.total_price ?? 0) - (summary?.total_payment ?? 0),
    payment_method: "cash",
    status: "paid",
  };

  const onHandleSubmit = useCallback(
    async (values: PaidFormValues, { setSubmitting, resetForm }: any) => {
      try {
        if (!values.bank_id) {
          alert("Bank / Cash account wajib dipilih");
          return;
        }

        if (values.amount <= 0) {
          alert("Nominal pembayaran harus lebih dari 0");
          return;
        }

        const payload = {
          delivery_id: values.delivery_id,
          bank_id: values.bank_id,
          amount: values.amount,
          note: values.note,
          status: values.status,
        };

        const res = await fetch("/api/payments/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Gagal menyimpan pembayaran");
        }

        await fetchDeliveryByCode(1, pageSize);
        await fetchSummaryByCode();
        await fetchPaymentsByCode();

        resetForm();
      } catch (err: any) {
        console.error("PAYMENT ERROR:", err);
        alert(err.message || "Terjadi kesalahan");
      } finally {
        setSubmitting(false);
      }
    },
    [fetchDeliveryByCode, fetchSummaryByCode, pageSize, onSaved, onClose]
  );

  const handleDeletePayment = useCallback(
    async (id: string) => {
      const confirmDelete = confirm("Yakin ingin menghapus pembayaran ini?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/payments/payment?id=${id}`, {
          method: "DELETE",
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Gagal menghapus pembayaran");
        }

        await fetchDeliveryByCode(1, pageSize);
        await fetchSummaryByCode();
        await fetchPaymentsByCode();
      } catch (err: any) {
        alert(err.message || "Terjadi kesalahan");
      }
    },
    [fetchPaymentsByCode, fetchSummaryByCode, pageSize]
  );

  useEffect(() => {
    fetchDeliveryByCode(1, pageSize);
    fetchSummaryByCode();
    fetchPaymentsByCode();
  }, [fetchDeliveryByCode, fetchSummaryByCode, fetchPaymentsByCode, pageSize]);

  return (
    <BaseModal
      title="Tambah Pembayaran"
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <div className="grid grid-cols-3 gap-4 h-[28.4rem]">
        <PaidForm initialValues={initialValues} onSubmit={onHandleSubmit} />
        <div className="col-span-2">
          <PaymentList payments={payments} onDelete={handleDeletePayment} />
        </div>
      </div>
    </BaseModal>
  );
}
