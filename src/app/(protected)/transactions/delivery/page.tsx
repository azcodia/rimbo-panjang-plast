"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useDeliveryContext } from "@/context/DeliveryContext";
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

  return (
    <div className="bg-white m-4 p-4">
      <TableWithControls
        columns={columns as any}
        data={data}
        total={total}
        page={page}
        totalPages={totalPages}
        loading={loading}
        showSearch={false}
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
        }}
      />
    </div>
  );
}
