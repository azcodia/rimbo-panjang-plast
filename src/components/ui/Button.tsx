import React from "react";
import clsx from "clsx";
import LoadingSpinner from "../LoadingSpinner";

interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  loading?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  className = "",
  loading = false,
  onClick,
}) => {
  const isDisabled = loading;

  const defaultClasses = "bg-success hover:bg-success-light text-white";

  const finalClassName = clsx(
    "w-full py-3 rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2",
    isDisabled && "opacity-50 cursor-not-allowed",
    className.includes("bg-") ||
      className.includes("text-") ||
      className.includes("hover:")
      ? className
      : clsx(defaultClasses, className)
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={finalClassName}
    >
      <span className="flex flex-row gap-1.5 items-center justify-center text-sm">
        {loading && <LoadingSpinner />} {text}
      </span>
    </button>
  );
};

export default Button;
