import * as Yup from "yup";

export const StockSchema = Yup.object().shape({
  colorId: Yup.string().required("Color is required"),
  sizeId: Yup.string().required("Size is required"),
  heavyId: Yup.string().required("Heavy is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be an integer"),
  inputDate: Yup.string().required("Date is required"),
});
