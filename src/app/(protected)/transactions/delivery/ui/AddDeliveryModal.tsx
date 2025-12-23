"use client";

import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import { useState, useMemo } from "react";
import BaseModal from "@/components/ui/modals/modal";
import Button from "@/components/ui/Button";
import { useDeliveryContext } from "@/context/DeliveryContext";
import { useStock } from "@/hooks/useStock";
import DeliveryHeaderForm from "../form/AddDeliveryHeaderForm";
import AddDeliveryItemForm from "../form/AddDeliveryItemForm";

interface AddDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

interface DeliveryFormValues {
  customerId: string;
  code: string;
  note: string;
  description: string;
  inputDate: string;
  items: {
    colorId: string;
    sizeId: string;
    heavyId: string;
    quantity: number | "";
    unitPrice: number | "";
    discount?: number | "";
  }[];
}

const initialValues: DeliveryFormValues = {
  customerId: "",
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
      unitPrice: "",
      discount: 0,
    },
  ],
};

export default function AddDeliveryModal({
  isOpen,
  onClose,
  onSaved,
  size = "lg",
}: AddDeliveryModalProps) {
  const { addDelivery } = useDeliveryContext();
  const { allData: stocks } = useStock();
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
    values: DeliveryFormValues,
    { setSubmitting, resetForm }: FormikHelpers<DeliveryFormValues>
  ) => {
    try {
      const payload = {
        code: values.code,
        note: values.note,
        description: values.description,
        input_date: values.inputDate || new Date().toISOString(),
        customer_id: values.customerId,
        items: values.items.map((i) => {
          const stock = stocks.find(
            (s) =>
              s.color_id === i.colorId &&
              s.size_id === i.sizeId &&
              s.heavy_id === i.heavyId
          );

          const quantity = Number(i.quantity) || 0;
          const unit_price = Number(i.unitPrice) || 0;
          const discount = Number(i.discount) || 0;

          return {
            stock_id: stock?.id || "",
            color_id: i.colorId,
            size_id: i.sizeId,
            heavy_id: i.heavyId,
            quantity,
            unit_price,
            discount_per_item: discount,
            total_price: quantity * unit_price - discount,
          };
        }),
      };

      await addDelivery(payload as any);

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
      title="Add Delivery"
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto scrollbar-auto-hide">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DeliveryHeaderForm
                values={{
                  customerId: values.customerId,
                  code: values.code,
                  note: values.note,
                  description: values.description,
                  inputDate: values.inputDate,
                }}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
              />

              <div className="flex flex-col gap-4 overflow-y-auto scrollbar-auto-hide max-h-[77vh] col-span-2">
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-4">
                      {values.items.map((item, idx) => (
                        <AddDeliveryItemForm
                          key={idx}
                          item={item}
                          index={idx}
                          openIndex={openIndex}
                          setOpenIndex={setOpenIndex}
                          remove={remove}
                          stocks={stocks}
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
                            unitPrice: "",
                            discount: 0,
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
