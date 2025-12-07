"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useStockContext } from "@/context/StockContext";
import { useEffect } from "react";
import AddStockModal from "./AddStockModal";

export default function StockPage() {
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
  } = useStockContext();

  useEffect(() => {
    console.log("STOCK", data);
  }, [data]);

  return (
    <div className="bg-white m-4 p-4">
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
      <AddStockModal
        isOpen={isModalOpen}
        size="sm"
        onClose={() => setIsModalOpen(false)}
        // onSaved={() => fetchData(searchValue, page)}
      />
    </div>
  );
}
