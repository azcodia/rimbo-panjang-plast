"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { TableRow } from "@/components/table/Table";
import { useSnackbar } from "notistack";
import { createTokenHistory } from "@/lib/createTokenHistory";
import { formatDate } from "@/lib/formatDate";
import { formatNumber } from "@/lib/formatNumber";
import { groupAndSortStock } from "@/lib/groupedStock";

export interface StockData {
  id: string;
  color_id: string;
  color?: string;
  size_id: string;
  size?: string;
  heavy_id: string;
  heavy?: string;
  quantity: number;
  input_date?: string;
  tokenHistory?: string;
}

export const useStock = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<StockData>[]>([]);
  const [allData, setAllData] = useState<StockData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState<StockData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    { key: "color", label: "Color" },
    {
      key: "size",
      label: "Size",
      render: (_v: any, row: any) => `${row.size} cm`,
    },
    {
      key: "heavy",
      label: "Heavy",
      render: (_v: any, row: any) => `${row.heavy} gram`,
    },
    {
      key: "quantity",
      label: "Stock",
      render: (_v: any, row: any) => formatNumber(row.quantity || 0),
    },
    {
      key: "input_date",
      label: "Input Date",
      render: (_v: any, row: any) => formatDate(row.input_date),
    },
  ];

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

  const fetchData = useCallback(
    async (
      filter: string = filterValue,
      pageNum: number = page,
      color_id: string = selectedColor
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        if (color_id) params.append("color_id", color_id);
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
            input_date: d.input_date,
            tokenHistory: d.tokenHistory,
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
    [filterValue, page, pageSize, selectedColor]
  );

  const handleFilter = (val: string) => {
    setFilterValue(val);
    setPage(1);
    fetchData(val, 1, selectedColor);
  };

  const handleActionClick = (
    row: StockData,
    action: "paid" | "edit" | "delete" | "show"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete this stock?`)) {
        if (!row.tokenHistory) {
          console.error("No tokenHistory for this stock!");
          return;
        }
        deleteStock(row.id, row.tokenHistory, "( Stock deleted by user )");
      }
    } else if (action === "edit") {
      setEditingRow(row);
      setIsEditModalOpen(true);
    } else if (action === "show") {
      alert(`Stock details:
Color: ${row.color}
Size: ${row.size}
Heavy: ${row.heavy}
Quantity: ${row.quantity}
Input Date: ${row.input_date}`);
    }
  };

  const addStock = async (
    stock: Omit<StockData, "id" | "tokenHistory">,
    note = "Product baru"
  ) => {
    const tokenHistory = createTokenHistory();
    try {
      const res = await fetch("/api/stocks/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stock,
          tokenHistory,
          input_date: stock.input_date ? new Date(stock.input_date) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add stock");
      await fetchData(filterValue, page, selectedColor);

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
          input_date: stock.input_date ? new Date(stock.input_date) : undefined,
          tokenHistory,
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

  const deleteStock = async (
    id: string,
    tokenHistory: string,
    note = "( Stock deleted by user )"
  ) => {
    try {
      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      const resHistory = await fetch(
        "/api/history-transactions/history-transaction",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tokenHistory, note }),
        }
      );
      if (!resHistory.ok) throw new Error("Failed to delete history");

      const res = await fetch(`/api/stocks/stock?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete stock");

      await fetchData(filterValue, page, selectedColor);
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
    stock: Omit<StockData, "id" | "tokenHistory">,
    note = "Stock updated"
  ) => {
    try {
      const oldStock = allData.find((s) => s.id === id);
      const res = await fetch(`/api/stocks/stock?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stock,
          input_date: stock.input_date ? new Date(stock.input_date) : undefined,
          tokenHistory: oldStock?.tokenHistory,
        }),
      });
      if (!res.ok) throw new Error("Failed to update stock");

      await fetchData(filterValue, page, selectedColor);

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
              input_date: stock.input_date
                ? new Date(stock.input_date)
                : undefined,
              tokenHistory: oldStock?.tokenHistory,
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

  const groupeddataStock = useMemo(
    () =>
      groupAndSortStock(
        allData.map((d) => ({
          ...d,
          size: d.size ?? "0",
          color: d.color ?? "",
        }))
      ),
    [allData]
  );

  useEffect(() => {
    fetchData(filterValue, page, selectedColor);
  }, [fetchData, page, pageSize, filterValue, selectedColor]);

  return {
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
    selectedColor,
    setSelectedColor,
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
  };
};
