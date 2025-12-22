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
import { useSnackbar } from "notistack";
import { formatNumber } from "@/lib/formatNumber";

export interface HeavyData {
  id: string;
  weight: number;
}

interface HeavyContextType {
  data: TableRow<HeavyData>[];
  allData: HeavyData[];
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
  editingRow: HeavyData | null;
  setEditingRow: (row: HeavyData | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  handleFilter: (val: string) => void;
  selectedWeight: string | null;
  setSelectedWeight: (val: string | null) => void;
  handleActionClick: (
    row: HeavyData,
    action: "edit" | "delete" | "show" | "paid"
  ) => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
  addHeavy: (weight: number) => Promise<void>;
  deleteHeavy: (id: string) => Promise<void>;
  updateHeavy: (id: string, weight: number) => Promise<void>;
}

const HeavyContext = createContext<HeavyContextType | undefined>(undefined);

export const HeavyProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<HeavyData>[]>([]);
  const [allData, setAllData] = useState<HeavyData[]>([]);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState<HeavyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    {
      key: "weight",
      label: "Weight",
      render: (_value: any, row: { weight: any }) =>
        `${formatNumber(row.weight)} gram`,
    },
  ];

  const fetchData = useCallback(
    async (filter: string = filterValue, pageNum: number = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(`/api/heavies/heavy?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          const mappedData: HeavyData[] = json.data.map((d: any) => ({
            id: d._id,
            weight: d.weight,
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
        console.error("Failed to fetch heavies:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page, filterValue]
  );

  const selectOptions: SelectOption<string>[] = [
    { label: "All", value: "" },
    ...allData.map((h) => ({
      label: `${h.weight} gram`,
      value: h.id,
    })),
  ];

  const handleFilter = (val: string) => {
    setFilterValue(val);
    setPage(1);
    fetchData(val, 1);
  };

  const handleActionClick = (
    row: HeavyData,
    action: "edit" | "delete" | "show" | "paid"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete "${row.weight} g"?`)) {
        deleteHeavy(row.id);
      }
    } else if (action === "edit") {
      setEditingRow(row);
      setIsEditModalOpen(true);
    } else if (action === "show") {
      alert(`Show clicked: ${row.weight} g`);
    }
  };

  const addHeavy = async (weight: number) => {
    try {
      const res = await fetch("/api/heavies/heavy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add heavy");
      await fetchData();
      enqueueSnackbar(`Added heavy ${weight} g successfully`, {
        variant: "success",
      });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const deleteHeavy = async (id: string) => {
    try {
      const res = await fetch(`/api/heavies/heavy?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete heavy");
      await fetchData();
      enqueueSnackbar("Deleted heavy successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const updateHeavy = async (id: string, weight: number) => {
    try {
      const res = await fetch(`/api/heavies/heavy?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update heavy");
      await fetchData();
      enqueueSnackbar(`Updated heavy to ${weight} g`, { variant: "success" });
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
    <HeavyContext.Provider
      value={{
        data,
        allData,
        selectOptions,
        page,
        setPage,
        columns,
        pageSize,
        setPageSize,
        selectedWeight,
        setSelectedWeight,
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
        addHeavy,
        deleteHeavy,
        updateHeavy,
      }}
    >
      {children}
    </HeavyContext.Provider>
  );
};

export const useHeavyContext = () => {
  const context = useContext(HeavyContext);
  if (!context)
    throw new Error("useHeavyContext must be used within a HeavyProvider");
  return context;
};
