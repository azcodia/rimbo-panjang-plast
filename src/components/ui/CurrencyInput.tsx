"use client";

import React from "react";
import { NumericFormat } from "react-number-format";

interface CurrencyInputProps {
  label?: string;
  value: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-gray-500 mb-1">{label}</label>}

      <NumericFormat
        value={value}
        thousandSeparator=","
        prefix="Rp."
        placeholder={placeholder}
        className={`
          w-full p-2.5 rounded-md bg-grayd text-[#1f1f1f] border
          ${error ? "border-danger" : "border-gray-100"}
          focus:border-success-light focus:ring-1 focus:ring-success
          focus:outline-none transition-all duration-200 shadow-sm
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
        onValueChange={(vals) => onChange?.(vals.value)}
        disabled={disabled}
      />

      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CurrencyInput;
