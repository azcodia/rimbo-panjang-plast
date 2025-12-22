"use client";

import React from "react";
import { Edit, Trash2, Eye, BanknoteArrowUp } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

interface Column<T> {
  key: string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export type TableAction = "paid" | "edit" | "delete" | "show";

export interface TableRow<T> {
  data: T;
  actions?: TableAction[];
}

interface TableProps<T> {
  columns: Column<T>[];
  data: TableRow<T>[];
  page: number;
  totalPages: number;
  totalDataCount?: number;
  onPageChange?: (newPage: number) => void;
  onActionClick?: (row: T, action: TableAction) => void;
  filterValue?: string;
  loading?: boolean;
  className?: string;
  visibleActions?: TableAction[];
  emptyMessage?: string;
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  page,
  totalPages,
  totalDataCount,
  onPageChange,
  onActionClick,
  visibleActions,
  loading = false,
  emptyMessage = "No data available",
}: TableProps<T>) {
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
          <td colSpan={columns.length + 1} className="px-4 py-6 text-center">
            <LoadingSpinner size={5} color="text-gray-600 w-12 h-12" />
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length + 1}
            className="px-4 py-6 text-center text-gray-500"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className="odd:bg-white even:bg-grayd border-b border-default"
      >
        {columns.map((col) => (
          <td
            key={col.key}
            className="px-6 py-3 font-medium text-sm text-gray-700"
          >
            {col.render
              ? col.render(row.data[col.key], row.data)
              : row.data[col.key]}
          </td>
        ))}
        {row.actions && row.actions.length > 0 && (
          <td className="px-6 py-3 font-medium flex space-x-2">
            {row.actions
              .filter((a) => !visibleActions || visibleActions.includes(a))
              .map((a) => {
                if (a === "paid")
                  return (
                    <button
                      key="paid"
                      onClick={() => onActionClick?.(row.data, "paid")}
                      className="text-success-light hover:opacity-70 transition-colors"
                      title="Paid"
                    >
                      <BanknoteArrowUp strokeWidth={2.2} size={18} />
                    </button>
                  );
                if (a === "show")
                  return (
                    <button
                      key="show"
                      onClick={() => onActionClick?.(row.data, "show")}
                      className="text-gray-700 hover:opacity-70 transition-colors"
                      title="Show"
                    >
                      <Eye strokeWidth={2.2} size={16} />
                    </button>
                  );
                if (a === "edit")
                  return (
                    <button
                      key="edit"
                      onClick={() => onActionClick?.(row.data, "edit")}
                      className="text-gray-700 hover:opacity-70 transition-colors"
                      title="Edit"
                    >
                      <Edit strokeWidth={2.2} size={16} />
                    </button>
                  );
                if (a === "delete")
                  return (
                    <button
                      key="delete"
                      onClick={() => onActionClick?.(row.data, "delete")}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 strokeWidth={2.2} size={16} />
                    </button>
                  );
              })}
          </td>
        )}
      </tr>
    ));
  };

  return (
    <div className="relative overflow-x-auto bg-white shadow-xs rounded-md border border-default">
      <table className="w-full text-sm text-left rtl:text-right text-body">
        <thead>
          <tr className="bg-grayd text-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 font-medium text-left text-xs uppercase"
              >
                {col.label}
              </th>
            ))}
            {data.some((row) => row.actions?.length) && (
              <th className="px-6 py-3 font-medium text-left text-xs uppercase">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>

      <div className="flex justify-between items-center px-6 py-3 font-medium border-t border-gray-200">
        <span className="text-sm text-gray-400">
          Page {page} of {totalPages} / All data: {totalDataCount}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:text-gray-400 disabled:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={page === totalPages || loading}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:text-gray-400 disabled:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
