import React from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-gray-500 mb-1">{label}</label>}

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full p-3 rounded-md border
          ${error ? "border-danger" : "border-gray-300"}
          focus:border-primary focus:ring-1 focus:ring-primary
          focus:outline-none transition-all duration-200 shadow-sm
          ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-700"
              : "bg-white cursor-pointer"
          }
        `}
        disabled={disabled}
      />

      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DatePicker;
