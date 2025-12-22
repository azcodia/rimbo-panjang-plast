"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import { useBankContext } from "@/context/BankContext";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { BankSchema } from "@/lib/schemas/BankSchema";

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
}

export interface BankFormValues {
  type: "cash" | "bank";
  name: string;
  account_name?: string;
  account_number?: string;
  note?: string;
}

const initialValues: BankFormValues = {
  type: "cash",
  name: "",
  account_name: "",
  account_number: "",
  note: "",
};

export default function AddBankModal({
  isOpen,
  onClose,
  onSaved,
  size = "sm",
}: AddBankModalProps) {
  const { addBank } = useBankContext();

  const handleSubmit = async (
    values: BankFormValues,
    { setSubmitting, resetForm }: FormikHelpers<BankFormValues>
  ) => {
    try {
      await addBank(values);
      resetForm();
      onClose();
      onSaved?.();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal title="Add Bank" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        initialValues={initialValues}
        validationSchema={BankSchema}
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
