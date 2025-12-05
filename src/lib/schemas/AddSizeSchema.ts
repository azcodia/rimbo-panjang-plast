import * as Yup from "yup";

export const AddSizeSchema = Yup.object().shape({
  color_id: Yup.string().required("Color is required"),
  size: Yup.number()
    .typeError("Size must be a number")
    .required("Size is required")
    .positive("Size must be positive")
    .integer("Size must be an integer"),
});
