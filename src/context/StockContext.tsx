"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { TableRow } from "@/components/table/Table";
import { SelectOption } from "@/types/select";
import { useSnackbar } from "notistack";

export interface StockData {
  id: string;
  color_id: string;
  color?: string;
  size_id: string;
  size?: string;
  heavy_id: string;
  heavy?: string;
  quantity: number;
}

interface StockContextType {
  data: TableRow<StockData>[];
  allData: StockData[];
  groupeddataStock: TableRow<StockData>[];
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
  editingRow: StockData | null;
  setEditingRow: (row: StockData | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  handleFilter: (val: string) => void;
  handleActionClick: (
    row: StockData,
    action: "edit" | "delete" | "show"
  ) => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
  addStock: (stock: Omit<StockData, "id">, note?: string) => Promise<void>;
  deleteStock: (id: string, note?: string) => Promise<void>;
  updateStock: (
    id: string,
    stock: Omit<StockData, "id">,
    note?: string
  ) => Promise<void>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<StockData>[]>([]);
  const [allData, setAllData] = useState<StockData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState<StockData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    { key: "color", label: "Color" },
    { key: "size", label: "Size" },
    { key: "heavy", label: "Heavy" },
    { key: "quantity", label: "Stock" },
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

        const res = await fetch(`/api/stocks/stock?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          const mappedData: StockData[] = json.data.map((d: any) => ({
            id: d.id,
            color_id: d.color_id,
            color: d.color,
            size_id: d.size_id,
            size: d.size,
            heavy_id: d.heavy_id,
            heavy: d.heavy,
            quantity: d.quantity,
          }));
          setAllData(mappedData);
          setData(
            mappedData.map((item) => ({
              data: item,
              actions: ["edit", "delete", "show"],
            }))
          );
          setTotal(json.total);
        }
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
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
    row: StockData,
    action: "edit" | "delete" | "show"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete this stock?`)) {
        deleteStock(row.id, "Stock deleted");
      }
    } else if (action === "edit") {
      setEditingRow(row);
      setIsEditModalOpen(true);
    } else if (action === "show") {
      alert(
        `Stock details:\nColor: ${row.color}\nSize: ${row.size}\nHeavy: ${row.heavy}\nQuantity: ${row.quantity}`
      );
    }
  };

  const addStock = async (
    stock: Omit<StockData, "id">,
    note: string = "Product baru"
  ) => {
    try {
      const res = await fetch("/api/stocks/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add stock");

      await fetchData();

      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      await fetch("/api/history-transactions/history-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stock_id: json.data._id,
          color_id: stock.color_id,
          size_id: stock.size_id,
          heavy_id: stock.heavy_id,
          type: "in",
          quantity: stock.quantity,
          note,
        }),
      });

      enqueueSnackbar("Added stock successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const deleteStock = async (id: string, note: string = "Stock deleted") => {
    try {
      const res = await fetch(`/api/stocks/stock?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete stock");

      await fetchData();

      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      await fetch("/api/history-transactions/history-transaction", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stock_id: id,
          type: "out",
          quantity: json.data?.quantity || 0,
          note,
        }),
      });

      enqueueSnackbar("Deleted stock successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const updateStock = async (
    id: string,
    stock: Omit<StockData, "id">,
    note: string = "Stock updated"
  ) => {
    try {
      const oldStock = allData.find((s) => s.id === id);
      const res = await fetch(`/api/stocks/stock?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update stock");

      await fetchData();

      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      if (oldStock) {
        const diff = stock.quantity - oldStock.quantity;
        if (diff !== 0) {
          await fetch("/api/history-transactions/history-transaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              stock_id: id,
              color_id: stock.color_id,
              size_id: stock.size_id,
              heavy_id: stock.heavy_id,
              type: diff > 0 ? "in" : "out",
              quantity: Math.abs(diff),
              note,
            }),
          });
        }
      }

      enqueueSnackbar("Updated stock successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const groupeddataStock: TableRow<StockData>[] = useMemo(() => {
    const map = new Map<string, StockData[]>();
    allData.forEach((item) => {
      if (!map.has(item.color_id)) map.set(item.color_id, []);
      map.get(item.color_id)?.push({ ...item });
    });

    const grouped: TableRow<StockData>[] = [];

    map.forEach((items, color_id) => {
      items.forEach((item, index) => {
        grouped.push({
          data: {
            id: item.id,
            color_id: item.color_id,
            color: index === 0 ? item.color : "",
            size_id: item.size_id,
            size: item.size,
            heavy_id: item.heavy_id,
            heavy: item.heavy,
            quantity: item.quantity,
          },
          actions: ["edit", "delete", "show"],
        });
      });
    });

    return grouped;
  }, [allData]);

  useEffect(() => {
    fetchData(filterValue, page);
  }, [fetchData, page, pageSize, filterValue]);

  const selectOptions: SelectOption<string>[] = [
    { label: "All", value: "" },
    ...allData.map((s) => ({
      label: `${s.color_id}-${s.size_id}-${s.heavy_id}`,
      value: s.id,
    })),
  ];

  return (
    <StockContext.Provider
      value={{
        data,
        allData,
        groupeddataStock,
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
        addStock,
        deleteStock,
        updateStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context)
    throw new Error("useStockContext must be used within a StockProvider");
  return context;
};
