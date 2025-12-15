"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useStockContext } from "@/context/StockContext";
import AddStockModal from "./AddStockModal";
import EditStockModal from "./EditStockModal";

export default function StockPage() {
  const {
    groupeddataStock,
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
  } = useStockContext();

  return (
    <div className="bg-white m-4 p-4">
      <TableWithControls
        columns={columns as any}
        data={groupeddataStock}
        total={total}
        page={page}
        totalPages={totalPages}
        loading={loading}
        filterValue={filterValue}
        onFilterChange={handleFilter}
        onPageChange={setPage}
        onActionClick={handleActionClick}
        visibleActions={["delete"]}
        buttons={[{ text: "Tambah Data", onClick: () => setIsModalOpen(true) }]}
      />
      <AddStockModal
        isOpen={isModalOpen}
        size="sm"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => fetchData()}
      />
      <EditStockModal
        isOpen={isEditModalOpen}
        stock={editingRow}
        size="sm"
        onClose={() => setIsEditModalOpen(false)}
        onSaved={() => fetchData()}
      />
    </div>
  );
}
