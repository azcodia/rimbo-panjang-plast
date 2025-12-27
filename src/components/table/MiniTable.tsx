"use client";

import React from "react";
import LoadingSpinner from "../LoadingSpinner";

interface Column<T> {
  key: string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableRow<T> {
  data: T;
}

interface MiniTableProps<T> {
  columns: Column<T>[];
  data: TableRow<T>[];
  page: number;
  totalPages: number;
  totalDataCount?: number;
  onPageChange?: (newPage: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function MiniTable<T extends Record<string, any>>({
  columns,
  data,
  page,
  totalPages,
  totalDataCount,
  onPageChange,
  loading = false,
  emptyMessage = "No data available",
  className,
}: MiniTableProps<T>) {
  const handlePrev = () => {
    if (onPageChange && page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (onPageChange && page < totalPages) onPageChange(page + 1);
  };

  const renderBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-3 py-4 text-center">
            <LoadingSpinner size={4} color="text-gray-600 w-8 h-8" />
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-3 py-4 text-center text-gray-500 text-xs"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
      >
        {columns.map((col) => (
          <td
            key={col.key}
            className="px-3 py-2 text-xs text-gray-700 font-medium"
          >
            {col.key === "actions" ? (
              <div className="flex justify-center items-center">
                {col.render
                  ? col.render(row.data[col.key], row.data)
                  : row.data[col.key]}
              </div>
            ) : col.render ? (
              col.render(row.data[col.key], row.data)
            ) : (
              row.data[col.key]
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div
      className={`relative overflow-x-auto bg-white shadow-xs rounded-md border border-gray-200 ${className}`}
    >
      <table className="w-full text-xs text-left text-body">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2 font-medium uppercase ${
                  col.key === "actions" ? "text-center" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>

      <div className="flex justify-between items-center px-3 py-2 font-medium border-t border-gray-200 text-xs">
        <span className="text-gray-400">
          Page {page} of {totalPages} / All data: {totalDataCount}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 disabled:text-gray-400 disabled:bg-gray-50 transition-colors text-xs"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={page === totalPages || loading}
            className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 disabled:text-gray-400 disabled:bg-gray-50 transition-colors text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
