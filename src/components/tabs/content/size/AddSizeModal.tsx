"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import { useSizeContext } from "@/context/SizeContext";
import { useColorContext } from "@/context/ColorContext";
import Select from "@/components/ui/Select";
import * as Yup from "yup";

interface AddSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  size?: "sm" | "md" | "lg";
}

interface SizeFormValues {
  size: number | "";
  colorId: string;
}

const AddSizeSchema = Yup.object().shape({
  colorId: Yup.string().required("Color is required"),
  size: Yup.number()
    .typeError("Size must be a number")
    .required("Size is required")
    .positive("Size must be positive")
    .integer("Size must be an integer"),
});

const initialValues: SizeFormValues = { size: "", colorId: "" };

export default function AddSizeModal({
  isOpen,
  onClose,
  onSaved,
  size = "sm",
}: AddSizeModalProps) {
  const { addSize } = useSizeContext();
  const { allData: colors } = useColorContext();

  const handleSubmit = async (
    values: SizeFormValues,
    { setSubmitting, resetForm }: FormikHelpers<SizeFormValues>
  ) => {
    try {
      await addSize(values.colorId, Number(values.size));
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
    <BaseModal title="Add Size" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        initialValues={initialValues}
        validationSchema={AddSizeSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Select
              label="Color"
              value={values.colorId}
              onChange={(val) => setFieldValue("colorId", val)}
              options={colors.map((c) => ({ value: c.id, label: c.color }))}
              error={touched.colorId ? errors.colorId : undefined}
            />

            <Input
              label="Size"
              type="number"
              placeholder="Enter size"
              value={values.size.toString()}
              onChange={(val) =>
                setFieldValue("size", val === "" ? "" : Number(val))
              }
              error={touched.size ? errors.size : undefined}
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
