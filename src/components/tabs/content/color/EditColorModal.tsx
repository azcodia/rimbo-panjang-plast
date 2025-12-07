"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import { AddColorSchema } from "@/lib/schemas/AddColorSchema";
import { useColorContext } from "@/context/ColorContext";

interface EditColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
  id: string;
  defaultColorName: string;
}

interface ColorFormValues {
  colorName: string;
}

export default function EditColorModal({
  isOpen,
  onClose,
  onSaved,
  id,
  defaultColorName,
  size = "sm",
}: EditColorModalProps) {
  const { updateColor } = useColorContext();

  const initialValues: ColorFormValues = {
    colorName: defaultColorName || "",
  };

  const handleSubmit = async (
    values: ColorFormValues,
    { setSubmitting }: FormikHelpers<ColorFormValues>
  ) => {
    try {
      await updateColor(id, values.colorName);
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
    <BaseModal title="Edit Color" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        enableReinitialize
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
