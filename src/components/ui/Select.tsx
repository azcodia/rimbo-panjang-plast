import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  label,
  error,
  options,
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-gray-500 mb-1">{label}</label>}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full p-3 rounded-sm bg-gray-50 border
          ${error ? "border-danger" : "border-gray-100"}
          focus:border-primary focus:ring-1 focus:ring-primary
          focus:outline-none transition-all duration-200 shadow-sm
        `}
      >
        <option value="" disabled>
          Select {label || ""}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
