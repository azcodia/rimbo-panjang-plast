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
import { SelectOption } from "@/types/select";

export interface ColorData {
  id: string;
  color: string;
}

interface ColorContextType {
  data: TableRow<ColorData>[];
  allData: ColorData[];
  selectOptions: SelectOption<string>[];
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
  editingRow: ColorData | null;
  setEditingRow: (row: ColorData | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  handleFilter: (val: string) => void;
  selectedColor: string | null;
  setSelectedColor: (val: string | null) => void;
  handleActionClick: (
    row: ColorData,
    action: "edit" | "delete" | "show"
  ) => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
  addColor: (color: string) => Promise<void>;
  deleteColor: (id: string) => Promise<void>;
  updateColor: (id: string, color: string) => Promise<void>;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<TableRow<ColorData>[]>([]);
  const [allData, setAllData] = useState<ColorData[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState<ColorData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [{ key: "color", label: "Color" }];

  const fetchData = useCallback(
    async (filter: string = filterValue, pageNum: number = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(`/api/colors/color?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          const mappedData: ColorData[] = json.data.map((d: any) => ({
            id: d._id,
            color: d.color,
          }));
          setAllData(mappedData);

          setData(
            mappedData.map((item) => ({
              data: item,
              actions: ["show", "edit", "delete"],
            }))
          );

          setTotal(json.total);
        }
      } catch (err) {
        console.error("Failed to fetch colors:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page, filterValue]
  );

  const selectOptions: SelectOption<string>[] = [
    { label: "All", value: "" },
    ...allData.map((c) => ({
      label: c.color,
      value: c.id,
    })),
  ];

  const handleFilter = (val: string) => {
    setFilterValue(val);
    setPage(1);
    fetchData(val, 1);
  };

  const handleActionClick = (
    row: ColorData,
    action: "edit" | "delete" | "show"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete "${row.color}"?`)) {
        deleteColor(row.id);
      }
    } else if (action === "edit") {
      setEditingRow(row);
      setIsEditModalOpen(true);
    } else if (action === "show") {
      alert(`Show clicked: ${row.color}`);
    }
  };

  const addColor = async (color: string) => {
    try {
      const res = await fetch("/api/colors/color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add color");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  const deleteColor = async (id: string) => {
    try {
      const res = await fetch(`/api/colors/color?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete color");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  const updateColor = async (id: string, color: string) => {
    try {
      const res = await fetch(`/api/colors/color?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update color");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchData(filterValue, page);
  }, [fetchData, page, pageSize, filterValue]);

  return (
    <ColorContext.Provider
      value={{
        data,
        allData,
        selectOptions,
        page,
        setPage,
        columns,
        pageSize,
        setPageSize,
        selectedColor,
        setSelectedColor,
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
        addColor,
        deleteColor,
        updateColor,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context)
    throw new Error("useColorContext must be used within a ColorProvider");
  return context;
};
