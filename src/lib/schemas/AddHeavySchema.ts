import * as Yup from "yup";

export const AddHeavySchema = Yup.object().shape({
  weight: Yup.number()
    .typeError("Weight must be a number")
    .required("Weight is required")
    .positive("Weight must be greater than 0"),
});
