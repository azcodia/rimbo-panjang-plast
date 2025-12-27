"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useBankContext } from "@/context/BankContext";
import AddBankModal from "./AddBankModal";
import EditBankModal from "./EditBankModal";
import PageContainer from "@/components/PageContainer";

export default function BankPage() {
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
  } = useBankContext();

  return (
    <PageContainer title="Manajemen Bank">
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
            text: "Tambah Bank",
            onClick: () => setIsModalOpen(true),
          },
        ]}
      />

      <AddBankModal
        isOpen={isModalOpen}
        size="sm"
        onClose={() => setIsModalOpen(false)}
        onSaved={() => fetchData(filterValue, page)}
      />

      {editingRow && (
        <EditBankModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={() => fetchData(filterValue, page)}
          id={editingRow.id}
          defaultBankData={{
            type: editingRow.type,
            name: editingRow.name,
            account_name: editingRow.account_name,
            account_number: editingRow.account_number,
            note: editingRow.note,
          }}
        />
      )}
    </PageContainer>
  );
}
