"use client";

import { useState } from "react";
import TableWithControls from "@/components/table/TableWithControls";
import { useStockContext } from "@/context/StockContext";
import { useColorContext } from "@/context/ColorContext";
import AddStockModal from "./AddStockModal";
import EditStockModal from "./EditStockModal";

export default function StockPage() {
  const {
    groupeddataStock,
    page,
    pageSize,
    total,
    columns,
    loading,
    filterValue,
    setPage,
    handleFilter,
    handleActionClick,
    fetchData,
  } = useStockContext();

  const { selectOptions, selectedColor, setSelectedColor } = useColorContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  return (
    <div className="bg-white m-4 p-4">
      <TableWithControls
        columns={columns as any}
        selectOptions={selectOptions}
        selectedValue={selectedColor ?? undefined}
        onSelectChange={(val) => {
          setSelectedColor(String(val));
          fetchData(filterValue, 1, String(val));
          setPage(1);
        }}
        data={groupeddataStock}
        total={total}
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        loading={loading}
        filterValue={filterValue}
        showSearch={false}
        onFilterChange={(value) => {
          handleFilter(value);
          setPage(1);
        }}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData(filterValue, newPage);
        }}
        onActionClick={handleActionClick}
        visibleActions={["delete"]}
        buttons={[
          {
            text: "Tambah Data",
            onClick: () => setIsAddModalOpen(true),
          },
        ]}
      />

      <AddStockModal
        isOpen={isAddModalOpen}
        size="sm"
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => fetchData(filterValue, page)}
      />

      {editingRow && (
        <EditStockModal
          isOpen={!!editingRow}
          stock={editingRow}
          size="sm"
          onClose={() => setEditingRow(null)}
          onSaved={() => fetchData(filterValue, page)}
        />
      )}
    </div>
  );
}
