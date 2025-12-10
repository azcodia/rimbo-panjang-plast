"use client";

import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import BaseModal from "@/components/ui/modals/modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/Date";
import { useReStockContext } from "@/context/RestockContext";
import { useStockContext } from "@/context/StockContext";
import StockCascadingDropdown from "@/components/stock/StockCascadingDropdown";

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

  const handleSubmit = async (
    values: ReStockFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ReStockFormValues>
  ) => {
    try {
      const payload = {
        code: values.code,
        note: values.note,
        description: values.description,
        input_date: values.inputDate || new Date().toISOString(), // default sekarang
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
          <Form className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto scrollbar-auto-hide">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Form utama */}
              <div className="flex flex-col gap-4">
                <Input
                  label="ReStock Code"
                  placeholder="Enter code"
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

              {/* FieldArray items */}
              <div className="flex flex-col gap-4 overflow-y-auto scrollbar-auto-hide max-h-[60vh] col-span-2">
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-4">
                      {values.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="border p-4 rounded flex flex-col gap-3"
                        >
                          <h4 className="font-semibold">Item {idx + 1}</h4>

                          <StockCascadingDropdown
                            value={{
                              colorId: item.colorId,
                              sizeId: item.sizeId,
                              heavyId: item.heavyId,
                            }}
                            onChange={(vals) => {
                              setFieldValue(
                                `items.${idx}.colorId`,
                                vals.colorId
                              );
                              setFieldValue(`items.${idx}.sizeId`, vals.sizeId);
                              setFieldValue(
                                `items.${idx}.heavyId`,
                                vals.heavyId
                              );
                            }}
                          />

                          <Input
                            label="Quantity"
                            type="number"
                            placeholder="Enter quantity"
                            value={item.quantity}
                            onChange={(val) =>
                              setFieldValue(`items.${idx}.quantity`, val)
                            }
                            error={
                              typeof errors.items?.[idx] === "object" &&
                              errors.items[idx]?.quantity
                                ? errors.items[idx]?.quantity
                                : undefined
                            }
                          />

                          <div className="flex justify-end gap-2">
                            {values.items.length > 1 && (
                              <Button
                                type="button"
                                text="Remove"
                                className="bg-red-200 text-black hover:bg-red-300"
                                onClick={() => remove(idx)}
                              />
                            )}
                          </div>
                        </div>
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
