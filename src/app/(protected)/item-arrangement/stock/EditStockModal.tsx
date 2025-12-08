"use client";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import BaseModal from "@/components/ui/modals/modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useColorContext } from "@/context/ColorContext";
import { useSizeContext } from "@/context/SizeContext";
import { useStockContext, StockData } from "@/context/StockContext";
import { useHeavyContext } from "@/context/HeavyContext";
import { useEffect } from "react";

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock?: StockData | null;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
}

interface StockFormValues {
  colorId: string;
  sizeId: string;
  heavyId: string;
  quantity: string;
}

const StockSchema = Yup.object().shape({
  colorId: Yup.string().required("Color is required"),
  sizeId: Yup.string().required("Size is required"),
  heavyId: Yup.string().required("Heavy is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be an integer"),
});

export default function EditStockModal({
  isOpen,
  onClose,
  stock,
  onSaved,
  size = "sm",
}: EditStockModalProps) {
  const { allData: colors } = useColorContext();
  const { filteredSizes, fetchSizesByColor } = useSizeContext();
  const { selectOptions: heavies } = useHeavyContext();
  const { updateStock } = useStockContext();

  const initialValues: StockFormValues = {
    colorId: stock?.color_id || "",
    sizeId: stock?.size_id || "",
    heavyId: stock?.heavy_id || "",
    quantity: stock?.quantity.toString() || "",
  };

  const handleSubmit = async (
    values: StockFormValues,
    { setSubmitting }: FormikHelpers<StockFormValues>
  ) => {
    if (!stock) return;
    try {
      await updateStock(stock.id, {
        color_id: values.colorId,
        size_id: values.sizeId,
        heavy_id: values.heavyId,
        quantity: Number(values.quantity),
      });
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("LOGGGG", stock);
  }, [stock]);

  useEffect(() => {
    if (isOpen && stock?.color_id) {
      fetchSizesByColor(stock.color_id);
    }
  }, [isOpen, stock?.color_id]);

  return (
    <BaseModal title="Edit Stock" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
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
              disabled={true}
              options={colors.map((c) => ({ value: c.id, label: c.color }))}
              error={touched.colorId ? errors.colorId : undefined}
            />

            <Select
              label="Size"
              value={values.sizeId}
              onChange={(val) => setFieldValue("sizeId", val)}
              disabled={true}
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
              disabled={true}
              options={heavies.filter((h) => h.value !== "")}
              error={touched.heavyId ? errors.heavyId : undefined}
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
              <Button type="submit" text="Edit" loading={isSubmitting} />
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
