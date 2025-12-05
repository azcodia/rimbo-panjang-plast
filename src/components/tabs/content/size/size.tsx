"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useSizeContext } from "@/context/SizeContext";
import AddSizeModal from "./AddSizeModal";
import EditSizeModal from "./EditSizeModal";

export const SizeContent = () => {
  const {
    data,
    page,
    columns,
    totalPages,
    total,
    loading,
    filterValue,
    isModalOpen,
    editingRow,
    isEditModalOpen,
    setIsEditModalOpen,
    setPage,
    handleFilter,
    handleActionClick,
    setIsModalOpen,
    fetchData,
  } = useSizeContext();

  return (
    <>
      <TableWithControls
        columns={columns as any}
        data={data}
        total={total}
        page={page}
        totalPages={totalPages}
        loading={loading}
        filterValue={filterValue}
        onFilterChange={handleFilter}
        onPageChange={setPage}
        onActionClick={handleActionClick}
        visibleActions={["edit", "delete"]}
        buttons={[{ text: "Tambah Size", onClick: () => setIsModalOpen(true) }]}
      />

      <AddSizeModal
        isOpen={isModalOpen}
        size="sm"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => fetchData(filterValue, page)}
      />

      {editingRow && (
        <EditSizeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={() => fetchData()}
          id={editingRow.id}
          defaultSize={editingRow.size}
          defaultColorId={editingRow.color_id}
        />
      )}
    </>
  );
};
