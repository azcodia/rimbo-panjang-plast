"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import * as Yup from "yup";
import { useHeavyContext } from "@/context/HeavyContext";
import { AddHeavySchema } from "@/lib/schemas/AddHeavySchema";

interface EditHeavyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
  id: string;
  defaultWeight: number;
}

interface HeavyFormValues {
  weight: number | "";
}

export default function EditHeavyModal({
  isOpen,
  onClose,
  onSaved,
  id,
  defaultWeight,
  size = "sm",
}: EditHeavyModalProps) {
  const { updateHeavy } = useHeavyContext();

  const initialValues: HeavyFormValues = {
    weight: defaultWeight || "",
  };

  const handleSubmit = async (
    values: HeavyFormValues,
    { setSubmitting }: FormikHelpers<HeavyFormValues>
  ) => {
    try {
      await updateHeavy(id, Number(values.weight));
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
    <BaseModal title="Edit Heavy" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={AddHeavySchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Input
              label="Weight (gram)"
              placeholder="Enter weight in grams"
              type="number"
              value={values.weight === "" ? "" : values.weight.toString()}
              onChange={handleChange("weight")}
              error={touched.weight ? errors.weight : undefined}
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
