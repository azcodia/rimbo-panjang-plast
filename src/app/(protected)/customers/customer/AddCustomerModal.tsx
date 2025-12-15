"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import { useCustomerContext } from "@/context/CustomerContext";
import { CustomerSchema } from "@/lib/schemas/CustomerSchema";
import Select from "@/components/ui/Select";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
}

export interface CustomerFormValues {
  type: "individual" | "company";
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
}

const initialValues: CustomerFormValues = {
  type: "individual",
  name: "",
  email: "",
  phone: "",
  address: "",
  note: "",
};

export default function AddCustomerModal({
  isOpen,
  onClose,
  onSaved,
  size = "sm",
}: AddCustomerModalProps) {
  const { addCustomer } = useCustomerContext();

  const handleSubmit = async (
    values: CustomerFormValues,
    { setSubmitting, resetForm }: FormikHelpers<CustomerFormValues>
  ) => {
    try {
      await addCustomer(values);
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
    <BaseModal
      title="Add Customer"
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={CustomerSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Select
              label="Customer Type"
              value={values.type}
              onChange={handleChange("type")}
              error={touched.type ? errors.type : undefined}
              options={[
                { label: "Perorangan", value: "individual" },
                { label: "Pabrik / Perusahaan", value: "company" },
              ]}
            />
            <Input
              label="Name"
              placeholder="Enter customer name"
              value={values.name}
              onChange={handleChange("name")}
              error={touched.name ? errors.name : undefined}
            />

            <Input
              label="Email"
              placeholder="Enter email"
              value={values.email || ""}
              onChange={handleChange("email")}
              error={touched.email ? errors.email : undefined}
            />

            <Input
              label="Phone"
              placeholder="Enter phone number"
              value={values.phone || ""}
              onChange={handleChange("phone")}
              error={touched.phone ? errors.phone : undefined}
            />

            <Input
              label="Address"
              placeholder="Enter address"
              value={values.address || ""}
              onChange={handleChange("address")}
              error={touched.address ? errors.address : undefined}
            />

            <Input
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
