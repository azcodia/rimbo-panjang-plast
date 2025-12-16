"use client";

import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import { useState, useMemo } from "react";
import BaseModal from "@/components/ui/modals/modal";
import Button from "@/components/ui/Button";
import { useReStockContext } from "@/context/RestockContext";
import { useStockContext } from "@/context/StockContext";
import ReStockHeaderForm from "./form/ReStockHeaderForm";
import ReStockItemForm from "./form/ReStockItemForm";

interface AddReStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

interface ReStockFormValues {
  code: string;
  note: string;
  description: string;
  inputDate: string;
  items: {
    colorId: string;
    sizeId: string;
    heavyId: string;
    quantity: string;
  }[];
}

const initialValues: ReStockFormValues = {
  code: "",
  note: "",
  description: "",
  inputDate: new Date().toISOString().split("T")[0],
  items: [
    {
      colorId: "",
      sizeId: "",
      heavyId: "",
      quantity: "",
    },
  ],
};

export default function AddReStockModal({
  isOpen,
  onClose,
  onSaved,
  size = "lg",
}: AddReStockModalProps) {
  const { addReStock } = useReStockContext();
  const { allData: stocks } = useStockContext();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const colorMap: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(
        stocks.filter((s) => s.color).map((s) => [s.color_id, s.color || ""])
      ),
    [stocks]
  );

  const sizeMap: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(
        stocks
          .filter((s) => s.size !== undefined)
          .map((s) => [s.size_id, s.size?.toString() || ""])
      ),
    [stocks]
  );

  const heavyMap: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(
        stocks.filter((s) => s.heavy).map((s) => [s.heavy_id, s.heavy || ""])
      ),
    [stocks]
  );

  const handleSubmit = async (
    values: ReStockFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ReStockFormValues>
  ) => {
    try {
      const payload = {
        code: values.code,
        note: values.note,
        description: values.description,
        input_date: values.inputDate || new Date().toISOString(),
        items: values.items.map((i) => {
          const stock = stocks.find(
            (s) =>
              s.color_id === i.colorId &&
              s.size_id === i.sizeId &&
              s.heavy_id === i.heavyId
          );

          return {
            stock_id: stock?.id || "",
            color_id: i.colorId,
            size_id: i.sizeId,
            heavy_id: i.heavyId,
            quantity: Number(i.quantity),
          };
        }),
      };

      await addReStock(payload);

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
    <BaseModal
      title="Add ReStock"
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto scrollbar-auto-hide">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReStockHeaderForm
                values={{
                  code: values.code,
                  note: values.note,
                  description: values.description,
                  inputDate: values.inputDate,
                }}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
              />

              <div className="flex flex-col gap-4 overflow-y-auto scrollbar-auto-hide max-h-[62vh] col-span-2">
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-4">
                      {values.items.map((item, idx) => (
                        <ReStockItemForm
                          key={idx}
                          item={item}
                          index={idx}
                          openIndex={openIndex}
                          setOpenIndex={setOpenIndex}
                          remove={remove}
                          colorMap={colorMap}
                          sizeMap={sizeMap}
                          heavyMap={heavyMap}
                          setFieldValue={setFieldValue}
                          itemsLength={values.items.length}
                        />
                      ))}

                      <Button
                        type="button"
                        text="Add Item"
                        onClick={() =>
                          push({
                            colorId: "",
                            sizeId: "",
                            heavyId: "",
                            quantity: "",
                          })
                        }
                      />
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
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
