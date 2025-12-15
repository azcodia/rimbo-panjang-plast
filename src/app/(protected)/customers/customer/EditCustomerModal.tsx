"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import { useCustomerContext } from "@/context/CustomerContext";
import { CustomerSchema } from "@/lib/schemas/CustomerSchema";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
  id: string;
  defaultCustomerData: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    note?: string;
  };
}

interface CustomerFormValues {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
}

export default function EditCustomerModal({
  isOpen,
  onClose,
  onSaved,
  id,
  defaultCustomerData,
  size = "sm",
}: EditCustomerModalProps) {
  const { updateCustomer } = useCustomerContext();

  const initialValues: CustomerFormValues = {
    name: defaultCustomerData.name || "",
    email: defaultCustomerData.email || "",
    phone: defaultCustomerData.phone || "",
    address: defaultCustomerData.address || "",
    note: defaultCustomerData.note || "",
  };

  const handleSubmit = async (
    values: CustomerFormValues,
    { setSubmitting }: FormikHelpers<CustomerFormValues>
  ) => {
    try {
      await updateCustomer(id, values);
      onClose();

      if (onSaved) onSaved();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal
      title="Edit Customer"
      isOpen={isOpen}
      onClose={onClose}
      size={size}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={CustomerSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
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
