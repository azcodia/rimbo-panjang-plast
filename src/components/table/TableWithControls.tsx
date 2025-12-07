"use client";

import Table, { TableAction, TableRow } from "@/components/table/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface TableButton {
  text: string;
  onClick: () => void;
  className?: string;
  visible?: boolean;
}

interface SelectOption {
  label: string;
  value: string | number;
}

interface TableWithControlsProps<T extends Record<string, any>> {
  columns: {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }[];
  data: TableRow<T>[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  filterValue: string;
  onFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onActionClick: (row: T, action: TableAction) => void;
  buttons?: TableButton[];
  visibleActions: TableAction[];
  showSearch?: boolean;
  selectOptions?: SelectOption[];
  selectedValue?: string | number;
  onSelectChange?: (value: string | number) => void;
}

export default function TableWithControls<T extends Record<string, any>>({
  columns,
  data,
  total,
  page,
  totalPages,
  loading,
  filterValue,
  onFilterChange,
  onPageChange,
  onActionClick,
  buttons = [],
  visibleActions = ["edit", "delete"],
  showSearch = true,
  selectOptions = [],
  selectedValue,
  onSelectChange,
}: TableWithControlsProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="sm:w-60 w-full flex gap-2">
          {showSearch && (
            <Input
              value={filterValue}
              onChange={onFilterChange}
              placeholder="Search..."
            />
          )}

          {selectOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Filter</span>
              <select
                className="border px-2 py-1 rounded-md w-full sm:w-auto"
                value={selectedValue ?? ""}
                onChange={(e) =>
                  onSelectChange && onSelectChange(e.target.value)
                }
              >
                {selectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-2 sm:w-auto w-full">
          {buttons.map(
            (btn, idx) =>
              btn.visible !== false && (
                <Button
                  key={idx}
                  text={btn.text}
                  onClick={btn.onClick}
                  className={`sm:px-4 sm:py-2 w-full sm:w-auto ${
                    btn.className || ""
                  }`}
                />
              )
          )}
        </div>
      </div>

      <Table
        columns={columns as any}
        totalDataCount={total}
        data={data as any}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onActionClick={onActionClick as any}
        filterValue={filterValue}
        loading={loading}
        visibleActions={visibleActions}
      />
    </div>
  );
}
