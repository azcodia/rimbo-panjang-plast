"use client";

import TableWithControls from "@/components/table/TableWithControls";
import { useReStockContext } from "@/context/RestockContext";
import AddReStockModal from "./AddReStockModal";
import PageContainer from "@/components/PageContainer";

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

  return (
    <PageContainer title="Update Stok Barang">
      <TableWithControls
        columns={columns as any}
        data={data}
        total={total}
        page={page}
        totalPages={totalPages}
        showSearch={false}
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
        }}
      />
    </PageContainer>
  );
}
