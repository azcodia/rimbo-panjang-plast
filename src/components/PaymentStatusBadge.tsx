import React from "react";

type PaymentStatus = "paid" | "partially_paid" | "unpaid";

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "paid":
      return (
        <span className="flex justify-center items-center bg-success text-white text-[10px] font-semibold py-1 px-2 rounded-md">
          Lunas
        </span>
      );
    case "partially_paid":
      return (
        <span className="flex justify-center items-center bg-primary text-white text-[10px] font-semibold py-1 px-2 rounded-md">
          Belum Lunas
        </span>
      );
    case "unpaid":
      return (
        <span className="flex justify-center items-center bg-danger text-white text-[10px] font-semibold py-1 px-2 rounded-md">
          Belum Dibayar
        </span>
      );
    default:
      return (
        <span className="bg-gray-300 text-gray-700 text-[10px] font-semibold py-1 px-2 rounded-md">
          -
        </span>
      );
  }
};

export default PaymentStatusBadge;
