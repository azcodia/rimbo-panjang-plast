"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import { useBankContext } from "@/context/BankContext";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { BankSchema } from "@/lib/schemas/BankSchema";

interface EditBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  id: string;
  defaultBankData: BankFormValues;
}

export interface BankFormValues {
  type: "cash" | "bank";
  name: string;
  account_name?: string;
  account_number?: string;
  note?: string;
}

export default function EditBankModal({
  isOpen,
  onClose,
  onSaved,
  id,
  defaultBankData,
}: EditBankModalProps) {
  const { updateBank } = useBankContext();

  const handleSubmit = async (
    values: BankFormValues,
    { setSubmitting }: FormikHelpers<BankFormValues>
  ) => {
    try {
      await updateBank(id, values);
      onClose();
      onSaved?.();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal title="Edit Bank" isOpen={isOpen} onClose={onClose} size="sm">
      <Formik
        initialValues={defaultBankData}
        validationSchema={BankSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Select
              label="Type"
              value={values.type}
              onChange={handleChange("type")}
              error={touched.type ? errors.type : undefined}
              options={[
                { label: "Cash", value: "cash" },
                { label: "Bank", value: "bank" },
              ]}
            />

            <Input
              label="Name"
              placeholder={
                values.type === "cash" ? "e.g. Kas Gudang" : "e.g. BCA, Mandiri"
              }
              value={values.name}
              onChange={handleChange("name")}
              error={touched.name ? errors.name : undefined}
            />

            {values.type === "bank" && (
              <>
                <Input
                  label="Account Name"
                  placeholder="Account holder name"
                  value={values.account_name || ""}
                  onChange={handleChange("account_name")}
                  error={touched.account_name ? errors.account_name : undefined}
                />

                <Input
                  label="Account Number"
                  placeholder="Account number"
                  value={values.account_number || ""}
                  onChange={handleChange("account_number")}
                  error={
                    touched.account_number ? errors.account_number : undefined
                  }
                />
              </>
            )}

            <Textarea
              label="Note"
              placeholder="Additional note"
              value={values.note || ""}
              onChange={handleChange("note")}
              error={touched.note ? errors.note : undefined}
            />

            <div className="flex justify-end gap-2 mt-2">
              <Button type="submit" text="Update" loading={isSubmitting} />
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
