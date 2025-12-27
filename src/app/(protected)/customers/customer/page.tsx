"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useCustomerContext } from "@/context/CustomerContext";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import PageContainer from "@/components/PageContainer";

export default function CustomerPage() {
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
  } = useCustomerContext();

  return (
    <PageContainer title="Manajemen Pelanggan">
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
        buttons={[
          {
            text: "Tambah Customer",
            onClick: () => setIsModalOpen(true),
          },
        ]}
      />

      <AddCustomerModal
        isOpen={isModalOpen}
        size="sm"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => fetchData(filterValue, page)}
      />

      {editingRow && (
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={() => fetchData(filterValue, page)}
          id={editingRow.id}
          defaultCustomerData={{
            type: editingRow.type,
            name: editingRow.name,
            email: editingRow.email,
            phone: editingRow.phone,
            address: editingRow.address,
            note: editingRow.note,
          }}
        />
      )}
    </PageContainer>
  );
}
