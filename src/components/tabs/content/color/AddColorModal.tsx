"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import { AddColorSchema } from "@/lib/schemas/AddColorSchema";
import { useColorContext } from "@/context/ColorContext";

interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
}

interface ColorFormValues {
  colorName: string;
}

const initialValues: ColorFormValues = { colorName: "" };

export default function AddColorModal({
  isOpen,
  onClose,
  onSaved,
  size = "sm",
}: AddColorModalProps) {
  const { addColor } = useColorContext();

  const handleSubmit = async (
    values: ColorFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ColorFormValues>
  ) => {
    try {
      await addColor(values.colorName);
      resetForm();
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
    <BaseModal title="Add Color" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        initialValues={initialValues}
        validationSchema={AddColorSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Input
              label="Color Name"
              placeholder="Enter a color name"
              value={values.colorName}
              onChange={handleChange("colorName")}
              error={touched.colorName ? errors.colorName : undefined}
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
