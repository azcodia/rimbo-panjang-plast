import * as Yup from "yup";

export const BankSchema = Yup.object().shape({
  type: Yup.string().oneOf(["cash", "bank"]).required("Type is required"),
  name: Yup.string().required("Name is required"),
  account_name: Yup.string().when("type", {
    is: "bank",
    then: (schema) => schema.required("Account name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  account_number: Yup.string().when("type", {
    is: "bank",
    then: (schema) => schema.required("Account number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
