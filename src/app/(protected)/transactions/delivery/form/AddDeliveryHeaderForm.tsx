"use client";

import Input from "@/components/ui/Input";
import DatePicker from "@/components/ui/Date";
import { useCustomerContext } from "@/context/CustomerContext";
import Select from "@/components/ui/Select";

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
  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Customer (Optional)"
        value={values.customerId || ""}
        onChange={(val) => setFieldValue("customerId", val)}
        options={selectOptions}
        error={touched.customerId ? errors.customerId : undefined}
      />
      <Input
        label="Delivery Code"
        placeholder="Enter delivery code"
        value={values.code}
        onChange={(val) => setFieldValue("code", val)}
        error={touched.code ? errors.code : undefined}
      />
      <Input
        label="Note"
        placeholder="Enter note"
        value={values.note}
        onChange={(val) => setFieldValue("note", val)}
        error={touched.note ? errors.note : undefined}
      />
      <Input
        label="Description"
        placeholder="Enter description"
        value={values.description}
        onChange={(val) => setFieldValue("description", val)}
        error={touched.description ? errors.description : undefined}
      />
      <DatePicker
        label="Input Date"
        value={values.inputDate}
        onChange={(val) => setFieldValue("inputDate", val)}
        error={touched.inputDate ? errors.inputDate : undefined}
      />
    </div>
  );
}
