"use client";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({
  size = 5,
  color = "text-white",
}: LoadingSpinnerProps) {
  return (
    <div className="loader border-t-4 border-primary rounded-full w-8 h-8 animate-spin"></div>
  );
}
