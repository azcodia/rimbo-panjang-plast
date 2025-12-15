"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useDeliveryContext } from "@/context/DeliveryContext";
import { useEffect } from "react";
import { useStockContext } from "@/context/StockContext";
import AddDeliveryModal from "./AddDeliveryModal";

export default function DeliveryPage() {
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
  } = useDeliveryContext();

  const { fetchData: fetchStock } = useStockContext();

  useEffect(() => {
    console.log("DELIVERY DATA", data);
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
          { text: "Tambah Delivery", onClick: () => setIsModalOpen(true) },
        ]}
      />
      <AddDeliveryModal
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
