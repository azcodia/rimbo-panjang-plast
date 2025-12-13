"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useReStockContext } from "@/context/RestockContext";
import { useEffect } from "react";
import AddReStockModal from "./AddReStockModal";
import { useStockContext } from "@/context/StockContext";

export default function ReStockPage() {
  const {
    data,
    page,
    columns,
    totalPages,
    total,
    loading,
    filterValue,
    isModalOpen,
    setPage,
    handleFilter,
    handleActionClick,
    setIsModalOpen,
    fetchData,
  } = useReStockContext();
  const { fetchData: fetchStock } = useStockContext();

  useEffect(() => {
    console.log("RE-STOCK", data);
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
        visibleActions={["delete", "show"]}
        buttons={[
          { text: "Tambah Re-Stock", onClick: () => setIsModalOpen(true) },
        ]}
      />
      <AddReStockModal
        isOpen={isModalOpen}
        size="xl"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchData();
          fetchStock();
        }}
      />
    </div>
  );
}
