"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { TableRow } from "@/components/table/Table";
import { useSnackbar } from "notistack";

export interface ReStockItem {
  stock_id: string;
  color_id: string;
  size_id: string;
  heavy_id: string;
  quantity: number;
}

export interface ReStockData {
  id: string;
  code: string;
  user_id: string;
  note?: string;
  description?: string;
  created_at: string;
  items: ReStockItem[];
}

interface ReStockContextType {
  data: TableRow<ReStockData>[];
  allData: ReStockData[];
  page: number;
  setPage: (page: number) => void;
  columns: { key: string; label: string }[];
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  total: number;
  loading: boolean;
  filterValue: string;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  editingRow: ReStockData | null;
  setEditingRow: (row: ReStockData | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  handleFilter: (val: string) => void;
  handleActionClick: (
    row: ReStockData,
    action: "edit" | "delete" | "show"
  ) => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
  addReStock: (
    restock: Omit<ReStockData, "id" | "created_at">
  ) => Promise<void>;
  deleteReStock: (id: string) => Promise<void>;
  updateReStock: (
    id: string,
    restock: Omit<ReStockData, "id" | "created_at">
  ) => Promise<void>;
}

const ReStockContext = createContext<ReStockContextType | undefined>(undefined);

export const ReStockProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<ReStockData>[]>([]);
  const [allData, setAllData] = useState<ReStockData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState<ReStockData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    { key: "code", label: "Code" },
    { key: "note", label: "Note" },
    { key: "description", label: "Description" },
    {
      key: "items",
      label: "Items",
      render: (_value: any, row: ReStockData) =>
        row.items.map((i) => `Qty: ${i.quantity}`).join(", "),
    },
    { key: "created_at", label: "Created At" },
  ];

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  const fetchData = useCallback(
    async (filter: string = filterValue, pageNum: number = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(`/api/re-stocks/re-stock?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setAllData(json.data);
          setData(
            json.data.map((item: ReStockData) => ({
              data: item,
              actions: ["edit", "delete", "show"],
            }))
          );
          setTotal(json.total);
        }
      } catch (err) {
        console.error("Failed to fetch restocks:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterValue, page, pageSize]
  );

  const handleFilter = (val: string) => {
    setFilterValue(val);
    setPage(1);
    fetchData(val, 1);
  };

  const handleActionClick = (
    row: ReStockData,
    action: "edit" | "delete" | "show"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete this re-stock?`)) {
        deleteReStock(row.id);
      }
    } else if (action === "edit") {
      setEditingRow(row);
      setIsEditModalOpen(true);
    } else if (action === "show") {
      alert(
        `ReStock details:\nCode: ${row.code}\nNote: ${row.note}\nDescription: ${
          row.description
        }\nItems: ${row.items.map((i) => `Qty: ${i.quantity}`).join(", ")}`
      );
    }
  };

  const addReStock = async (
    restock: Omit<ReStockData, "id" | "created_at">
  ) => {
    try {
      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      const res = await fetch("/api/re-stocks/re-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(restock),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add re-stock");

      // juga bikin history transaction untuk tiap item
      for (const item of restock.items) {
        await fetch("/api/history-transactions/history-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stock_id: item.stock_id,
            color_id: item.color_id,
            size_id: item.size_id,
            heavy_id: item.heavy_id,
            type: "in",
            quantity: item.quantity,
            note: restock.note || "Re-stock added",
          }),
        });
      }

      await fetchData();
      enqueueSnackbar("ReStock added successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const deleteReStock = async (id: string) => {
    try {
      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(`/api/re-stocks/re-stock?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete re-stock");

      await fetchData();
      enqueueSnackbar("ReStock deleted successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const updateReStock = async (
    id: string,
    restock: Omit<ReStockData, "id" | "created_at">
  ) => {
    try {
      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(`/api/re-stocks/re-stock?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(restock),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update re-stock");

      // buat history transaction per item
      for (const item of restock.items) {
        await fetch("/api/history-transactions/history-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stock_id: item.stock_id,
            color_id: item.color_id,
            size_id: item.size_id,
            heavy_id: item.heavy_id,
            type: "in",
            quantity: item.quantity,
            note: restock.note || "Re-stock updated",
          }),
        });
      }

      await fetchData();
      enqueueSnackbar("ReStock updated successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchData(filterValue, page);
  }, [fetchData, page, pageSize, filterValue]);

  return (
    <ReStockContext.Provider
      value={{
        data,
        allData,
        page,
        setPage,
        columns,
        pageSize,
        setPageSize,
        totalPages: Math.ceil(total / pageSize),
        total,
        loading,
        filterValue,
        isModalOpen,
        setIsModalOpen,
        editingRow,
        setEditingRow,
        isEditModalOpen,
        setIsEditModalOpen,
        handleFilter,
        handleActionClick,
        fetchData,
        addReStock,
        deleteReStock,
        updateReStock,
      }}
    >
      {children}
    </ReStockContext.Provider>
  );
};

export const useReStockContext = () => {
  const context = useContext(ReStockContext);
  if (!context)
    throw new Error("useReStockContext must be used within a ReStockProvider");
  return context;
};
