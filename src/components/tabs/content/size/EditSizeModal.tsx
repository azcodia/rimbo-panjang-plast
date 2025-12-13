"use client";

import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import BaseModal from "@/components/ui/modals/modal";
import Select from "@/components/ui/Select";
import { useSizeContext } from "@/context/SizeContext";
import { useColorContext } from "@/context/ColorContext";
import { EditSizeSchema } from "@/lib/schemas/EditSizeSchema";

interface EditSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  id: string;
  defaultColorId: string;
  defaultSize: number;
  size?: "sm" | "md" | "lg";
}

interface SizeFormValues {
  size: string;
  colorId: string;
}

export default function EditSizeModal({
  isOpen,
  onClose,
  onSaved,
  id,
  defaultColorId,
  defaultSize,
  size = "sm",
}: EditSizeModalProps) {
  const { updateSize } = useSizeContext();
  const { allData: colors } = useColorContext();

  const initialValues: SizeFormValues = {
    size: defaultSize.toString(),
    colorId: defaultColorId,
  };

  const handleSubmit = async (
    values: SizeFormValues,
    { setSubmitting }: FormikHelpers<SizeFormValues>
  ) => {
    try {
      await updateSize(id, Number(values.size), values.colorId);
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
    <BaseModal title="Edit Size" isOpen={isOpen} onClose={onClose} size={size}>
      <Formik
        initialValues={initialValues}
        validationSchema={EditSizeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
              label="Size (cm)"
              type="number"
              placeholder="Enter size"
              value={values.size}
              onChange={(val) => setFieldValue("size", val)}
              error={touched.size ? errors.size : undefined}
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
