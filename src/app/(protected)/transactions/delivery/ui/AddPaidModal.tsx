"use client";

import { useCallback, useEffect } from "react";
import BaseModal from "@/components/ui/modals/modal";
import { usePaidByCode } from "@/hooks/usePaidByCode";
import PaidForm, { PaidFormValues } from "../components/PaidForm";
import PaymentList from "../components/PaymentList";
import { useSnackbar } from "notistack";
import { formatRp } from "@/lib/formatRp";

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
    loadingSummary,
    loadingPayments,
    fetchDeliveryByCode,
    fetchSummaryByCode,
    fetchPaymentsByCode,
  } = usePaidByCode(deliveryCode);
  const { enqueueSnackbar } = useSnackbar();

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
    input_date: new Date().toISOString().split("T")[0],
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
          enqueueSnackbar("Bank / Cash account wajib dipilih", {
            variant: "warning",
          });
          return;
        }

        if (values.amount <= 0) {
          enqueueSnackbar("Nominal pembayaran harus lebih dari 0", {
            variant: "warning",
          });
          return;
        }

        if (values.amount > values.remaining_payment) {
          enqueueSnackbar(
            `Sisa pembayaran maksimal: ${formatRp(values.remaining_payment)}`,
            { variant: "warning" }
          );
          return;
        }

        const payload = {
          delivery_id: values.delivery_id,
          bank_id: values.bank_id,
          amount: values.amount,
          note: values.note,
          input_date: values.input_date,
          status: values.status,
        };

        const res = await fetch("/api/payments/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          enqueueSnackbar("Gagal menyimpan pembayaran", { variant: "error" });
          throw new Error(json.message || "Gagal menyimpan pembayaran");
        }
        enqueueSnackbar("Pembayaran berhasil di simpan", {
          variant: "success",
        });

        await fetchDeliveryByCode(1, pageSize);
        await fetchSummaryByCode();
        await fetchPaymentsByCode();
        onSaved?.();
        resetForm();
      } catch (err: any) {
        console.error("PAYMENT ERROR:", err);
        enqueueSnackbar("PAYMENT ERROR", { variant: "error" });
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
          enqueueSnackbar("Gagal menghapus pembayaran", {
            variant: "error",
          });
          throw new Error(json.message || "Gagal menghapus pembayaran");
        }

        enqueueSnackbar("Berhasil menghapus pembayaran", {
          variant: "success",
        });

        await fetchDeliveryByCode(1, pageSize);
        await fetchSummaryByCode();
        await fetchPaymentsByCode();
      } catch (err: any) {
        enqueueSnackbar("Terjadi kesalahan", {
          variant: "error",
        });
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
        <PaidForm
          initialValues={initialValues}
          onSubmit={onHandleSubmit}
          loading={loadingSummary}
        />
        <div className="col-span-2">
          <PaymentList
            payments={payments}
            onDelete={handleDeletePayment}
            loading={loadingPayments}
          />
        </div>
      </div>
    </BaseModal>
  );
}
