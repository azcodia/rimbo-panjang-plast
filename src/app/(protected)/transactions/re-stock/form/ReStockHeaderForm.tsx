"use client";

import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/Date";
import Textarea from "@/components/ui/Textarea";

interface ReStockHeaderFormProps {
  values: {
    code: string;
    note: string;
    description: string;
    inputDate: string;
  };
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
}

export default function ReStockHeaderForm({
  values,
  errors,
  touched,
  setFieldValue,
}: ReStockHeaderFormProps) {
  return (
    <div className="flex flex-col gap-4">
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
        label="Keterangan *"
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
