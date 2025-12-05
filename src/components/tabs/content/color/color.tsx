"use client";

import TableWithControls from "@/components/table/TableWithControls";
import AddColorModal from "./AddColorModal";
import { useColorContext } from "@/context/ColorContext";
import EditColorModal from "./EditColorModal";

export const ColorContent = () => {
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
  } = useColorContext();

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
        buttons={[{ text: "Tambah Data", onClick: () => setIsModalOpen(true) }]}
      />
      <AddColorModal
        isOpen={isModalOpen}
        size="sm"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => fetchData(filterValue, page)}
      />
      {editingRow && (
        <EditColorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={() => fetchData()}
          id={editingRow.id}
          defaultColorName={editingRow.color}
        />
      )}
    </>
  );
};
