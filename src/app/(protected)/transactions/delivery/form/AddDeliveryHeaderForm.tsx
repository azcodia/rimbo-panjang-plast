"use client";

import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/Date";
import { useCustomerContext } from "@/context/CustomerContext";
import Select from "@/components/ui/Select";
import { useEffect } from "react";
import Textarea from "@/components/ui/Textarea";

interface DeliveryHeaderFormProps {
  values: {
    customerId: string;
    code: string;
    note: string;
    description: string;
    inputDate: string;
  };
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
}

export default function DeliveryHeaderForm({
  values,
  errors,
  touched,
  setFieldValue,
}: DeliveryHeaderFormProps) {
  const { selectOptions } = useCustomerContext();

  useEffect(() => {
    if (selectOptions.length > 1 && !values.customerId) {
      setFieldValue("customerId", selectOptions[0].value);
    }
  }, [selectOptions, setFieldValue, values.customerId]);

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Nama Customer"
        value={values.customerId}
        onChange={(val) => setFieldValue("customerId", val)}
        options={selectOptions}
        error={touched.customerId ? errors.customerId : undefined}
      />
      <Input
        label="No Transaksi"
        placeholder="Isi No Transaksi"
        value={values.code}
        onChange={(val) => setFieldValue("code", val)}
        error={touched.code ? errors.code : undefined}
      />
      <Input
        label="Catatan *"
        placeholder="Isi Catatan"
        value={values.note}
        onChange={(val) => setFieldValue("note", val)}
        error={touched.note ? errors.note : undefined}
      />
      <Textarea
        label="Keterangan"
        placeholder="Isi Keterangan"
        value={values.description}
        onChange={(val) => setFieldValue("description", val)}
        error={touched.description ? errors.description : undefined}
      />
      <DatePicker
        label="Tanggal Transaksi"
        value={values.inputDate}
        onChange={(val) => setFieldValue("inputDate", val)}
        error={touched.inputDate ? errors.inputDate : undefined}
      />
    </div>
  );
}
