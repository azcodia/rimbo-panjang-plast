"use client";

import { Formik, Form } from "formik";
import CurrencyInput from "@/components/ui/CurrencyInput";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useBankContext } from "@/context/BankContext";

export interface PaidFormValues {
  delivery_id: string;
  bank_id: string;
  amount: number;
  note?: string;

  code: string;
  customer_name: string;
  total_price: number;
  total_payment: number;
  remaining_payment: number;
  payment_method: "cash" | "bank";
  status: "paid" | "pending";
}

interface Props {
  initialValues: PaidFormValues;
  onSubmit: (values: PaidFormValues, formik: any) => void;
}

export default function PaidForm({ initialValues, onSubmit }: Props) {
  const { cashBankOptions, transferBankOptions } = useBankContext();

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <div className="h-[28.3rem] overflow-y-auto scrollbar-auto-hide flex flex-col rounded-md border bg-white p-4 shadow-sm gap-4">
            <Input
              label="No Transaksi"
              value={values.code}
              onChange={() => undefined}
              disabled
            />
            <Input
              label="Nama Pelanggan"
              value={values.customer_name}
              onChange={() => undefined}
              disabled
            />

            <CurrencyInput
              label="Total Harga"
              value={values.total_price}
              disabled
            />
            <CurrencyInput
              label="Total Bayar"
              value={values.total_payment}
              disabled
            />
            <CurrencyInput
              label="Sisa Pembayaran"
              value={values.remaining_payment}
              disabled
            />

            <div className="flex gap-4">
              <div className="w-2/5">
                <Select
                  label="Metode"
                  value={values.payment_method}
                  onChange={(val) => {
                    setFieldValue("payment_method", val);
                    setFieldValue("bank_id", "");
                  }}
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "bank", label: "Bank" },
                  ]}
                />
              </div>

              <div className="w-3/5">
                <Select
                  label={
                    values.payment_method === "cash" ? "Cash Account" : "Bank"
                  }
                  value={values.bank_id}
                  onChange={(val) => setFieldValue("bank_id", val)}
                  options={
                    values.payment_method === "bank"
                      ? transferBankOptions
                      : cashBankOptions
                  }
                />
              </div>
            </div>

            <CurrencyInput
              label="Nominal Pembayaran"
              value={values.amount}
              onChange={(val) => setFieldValue("amount", val)}
            />

            <Textarea
              label="Catatan"
              value={values.note || ""}
              onChange={handleChange("note")}
              placeholder="Optional"
            />

            <Button type="submit" text="Simpan" />
          </div>
        </Form>
      )}
    </Formik>
  );
}
