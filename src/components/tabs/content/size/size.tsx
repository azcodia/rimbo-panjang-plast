"use client";

import { useState } from "react";
import TableWithControls from "@/components/table/TableWithControls";
import { useColorContext } from "@/context/ColorContext";
import EditSizeModal from "./EditSizeModal";
import AddSizeModal from "./AddSizeModal";
import { useSizeContext } from "@/context/SizeContext";

export function SizeContent() {
  const {
    tableData,
    loading,
    page,
    pageSize,
    total,
    setPage,
    searchValue,
    setSearchValue,
    handleAction,
    fetchData,
    columns,
  } = useSizeContext();
  const { selectOptions, selectedColor, setSelectedColor } = useColorContext();

  const [editingRow, setEditingRow] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="">
      <TableWithControls
        columns={columns}
        selectOptions={selectOptions}
        selectedValue={selectedColor ?? undefined}
        onSelectChange={(val) => {
          setSelectedColor(String(val));
          fetchData("", 1, String(val));
          setPage(page);
        }}
        data={tableData}
        total={total}
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        loading={loading}
        filterValue={searchValue}
        showSearch={false}
        onFilterChange={(value) => {
          setSearchValue(value);
          fetchData(value, 1);
          setPage(1);
        }}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData(searchValue, newPage);
        }}
        onActionClick={async (row, action) => {
          if (action === "edit") setEditingRow(row);
          else await handleAction(row, action);
        }}
        buttons={[
          {
            text: "Add Size",
            onClick: () => setIsAddModalOpen(true),
          },
        ]}
        visibleActions={["edit", "delete"]}
      />

      <AddSizeModal
        isOpen={isAddModalOpen}
        size="sm"
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => fetchData(searchValue, page)}
      />

      {editingRow && (
        <EditSizeModal
          isOpen={!!editingRow}
          onClose={() => setEditingRow(null)}
          id={editingRow.id}
          defaultSize={editingRow.size}
          defaultColorId={editingRow.color_id}
          onSaved={() => fetchData(searchValue, page)}
        />
      )}
    </div>
  );
}
