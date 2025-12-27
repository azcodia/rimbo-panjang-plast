"use client";

import { Mail, MapPinHouse, Phone, UserRound } from "lucide-react";
import { CustomerSummaryData } from "../../../services/customerDetail/customerSummary";

interface CustomerInfoProps {
  customer: CustomerSummaryData["customer"];
}

export default function CustomerInfo({ customer }: CustomerInfoProps) {
  const customerInfo = [
    { icon: UserRound, value: customer.type },
    { icon: Mail, value: customer.email || "-" },
    { icon: Phone, value: customer.phone || "-" },
    { icon: MapPinHouse, value: customer.address || "-" },
  ];

  return (
    <div className="rounded-md border bg-white py-2.5 shadow-sm">
      <div className="py-1.5 px-4 flex items-center border-b-[1px] mb-2">
        <h3 className="text-base font-semibold">Info Pelanggan</h3>
      </div>
      <div className="flex flex-col gap-2 text-sm px-4">
        {customerInfo.map(({ icon: Icon, value }, index) => (
          <div key={index} className="flex items-start gap-2">
            <Icon size={13} strokeWidth={2.2} className="mt-0.5 shrink-0" />
            <span className="leading-relaxed text-xs">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
