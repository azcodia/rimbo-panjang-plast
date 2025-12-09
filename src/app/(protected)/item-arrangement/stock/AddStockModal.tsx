"use client";

import { Formik, Form, FormikHelpers } from "formik";
import BaseModal from "@/components/ui/modals/modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/Date";
import { useColorContext } from "@/context/ColorContext";
import { useSizeContext } from "@/context/SizeContext";
import { useStockContext } from "@/context/StockContext";
import { useHeavyContext } from "@/context/HeavyContext";
import { StockSchema } from "@/lib/schemas/StockSchema";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
}

interface StockFormValues {
  colorId: string;
  sizeId: string;
  heavyId: string;
  quantity: string;
  inputDate: string;
}

const initialValues: StockFormValues = {
  colorId: "",
  sizeId: "",
  heavyId: "",
  quantity: "",
  inputDate: new Date().toISOString().split("T")[0], // default hari ini
};

export default function AddStockModal({
  isOpen,
  onClose,
  onSaved,
  size = "sm",
}: AddStockModalProps) {
  const { allData: colors } = useColorContext();
  const { filteredSizes, fetchSizesByColor } = useSizeContext();
  const { selectOptions: heavies } = useHeavyContext();
  const { addStock } = useStockContext();

  const handleSubmit = async (
    values: StockFormValues,
    { setSubmitting, resetForm }: FormikHelpers<StockFormValues>
  ) => {
    try {
      await addStock({
        color_id: values.colorId,
        size_id: values.sizeId,
        heavy_id: values.heavyId,
        quantity: Number(values.quantity),
        input_date: values.inputDate,
      });

      resetForm();
      onClose();
      onSaved?.();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal title="Add Stock" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        initialValues={initialValues}
        validationSchema={StockSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Select
              label="Color"
              value={values.colorId}
              onChange={async (val) => {
                setFieldValue("colorId", val);
                setFieldValue("sizeId", "");
                setFieldValue("heavyId", "");
                if (val) await fetchSizesByColor(val);
              }}
              options={colors.map((c) => ({ value: c.id, label: c.color }))}
              error={touched.colorId ? errors.colorId : undefined}
            />

            <Select
              label="Size"
              value={values.sizeId}
              onChange={(val) => setFieldValue("sizeId", val)}
              options={filteredSizes.map((s) => ({
                value: s.id,
                label: s.size.toString(),
              }))}
              error={touched.sizeId ? errors.sizeId : undefined}
            />

            <Select
              label="Heavy"
              value={values.heavyId}
              onChange={(val) => setFieldValue("heavyId", val)}
              options={heavies.filter((h) => h.value !== "")}
              error={touched.heavyId ? errors.heavyId : undefined}
            />

            <DatePicker
              label="Input Date"
              value={values.inputDate}
              onChange={(val) => setFieldValue("inputDate", val)}
              error={touched.inputDate ? errors.inputDate : undefined}
            />

            <Input
              label="Quantity"
              type="number"
              placeholder="Enter quantity"
              value={values.quantity}
              onChange={(val) => setFieldValue("quantity", val)}
              error={touched.quantity ? errors.quantity : undefined}
            />

            <div className="flex justify-end gap-2 mt-2">
              <Button type="submit" text="Save" loading={isSubmitting} />
              <Button
                type="button"
                text="Cancel"
                onClick={onClose}
                className="bg-gray-200 text-black hover:bg-gray-300"
              />
            </div>
          </Form>
        )}
      </Formik>
    </BaseModal>
  );
}
