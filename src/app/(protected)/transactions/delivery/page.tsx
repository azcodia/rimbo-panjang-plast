"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useDeliveryContext } from "@/context/DeliveryContext";
import AddDeliveryModal from "./AddDeliveryModal";
import AddPaidModal from "./AddPaidModal";
import ShowDetailDeliveryModal from "./ShowDeliveryModal";

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
    isModalPaidOpen,
    isModalDetailDeliveryOpen,
    selectedDelivery,
    setPage,
    handleFilter,
    handleActionClick,
    setIsModalOpen,
    setIsModalPaidOpen,
    setIsModalDetailDeliveryOpen,
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
        visibleActions={["paid", "show", "delete"]}
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

      {selectedDelivery && (
        <AddPaidModal
          size="xxl"
          isOpen={isModalPaidOpen}
          deliveryCode={selectedDelivery}
          onClose={() => setIsModalPaidOpen(false)}
          onSaved={() => fetchData()}
        />
      )}
      {selectedDelivery && (
        <ShowDetailDeliveryModal
          size="xxl"
          isOpen={isModalDetailDeliveryOpen}
          deliveryCode={selectedDelivery}
          onClose={() => setIsModalDetailDeliveryOpen(false)}
        />
      )}
    </div>
  );
}
