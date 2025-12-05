import * as Yup from "yup";

export const EditSizeSchema = Yup.object().shape({
  colorId: Yup.string().required("Color is required"),
  size: Yup.string()
    .required("Size is required")
    .test(
      "is-number",
      "Size must be a number",
      (val) => !isNaN(Number(val)) && Number(val) > 0
    ),
});
