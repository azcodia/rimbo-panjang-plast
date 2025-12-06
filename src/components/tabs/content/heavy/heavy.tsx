"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useHeavyContext } from "@/context/HeavyContext";
import AddHeavyModal from "./AddHeavyModal";
import EditHeavyModal from "./EditHeavyModal";

export const HeavyContent = () => {
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
  } = useHeavyContext();

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
      <AddHeavyModal
        isOpen={isModalOpen}
        size="sm"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => fetchData(filterValue, page)}
      />
      {editingRow && (
        <EditHeavyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={() => fetchData(filterValue, page)}
          id={editingRow.id}
          defaultWeight={editingRow.weight}
        />
      )}
    </>
  );
};
