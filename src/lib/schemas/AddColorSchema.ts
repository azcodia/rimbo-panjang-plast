import * as Yup from "yup";

export const AddColorSchema = Yup.object().shape({
  colorName: Yup.string()
    .required("Color is required")
    .max(20, "Maximum 20 characters"),
});
