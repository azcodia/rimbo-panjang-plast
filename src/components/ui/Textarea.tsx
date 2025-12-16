import React from "react";

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  rows = 3,
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-gray-500 mb-1">{label}</label>}

      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`
          w-full p-2.5 rounded-md bg-grayd text-[#1f1f1f] border
          ${error ? "border-danger" : "border-gray-100"} ${
          disabled ? "cursor-not-allowed" : ""
        }
          focus:border-success-light focus:ring-1 focus:ring-success
          focus:outline-none transition-all duration-200 shadow-sm
          resize-none
        `}
        disabled={disabled}
      />

      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;
