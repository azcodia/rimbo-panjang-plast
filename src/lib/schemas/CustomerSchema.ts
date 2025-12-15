import * as Yup from "yup";

export const CustomerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").optional(),
  phone: Yup.string().optional(),
  address: Yup.string().optional(),
  note: Yup.string().optional(),
});
