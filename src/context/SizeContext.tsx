"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { TableRow, TableAction } from "@/components/table/Table";
import { useSnackbar } from "notistack";

export interface SizeData {
  id: string;
  color_id: string;
  color_name: string;
  size: number;
}

interface GroupedSize {
  color_name: string;
  sizes: SizeData[];
}

interface SizeContextType {
  allData: SizeData[];
  groupedData: GroupedSize[];
  tableData: TableRow<any>[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  searchValue: string;
  columns: { key: string; label: string }[];
  fetchData: (
    filter?: string,
    pageNum?: number,
    color_id?: string
  ) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchValue: (value: string) => void;
  handleAction: (row: any, action: TableAction) => Promise<void>;
  addSize: (color_id: string, size: number) => Promise<void>;
  updateSize: (id: string, size: number, color_id: string) => Promise<void>;
  deleteSize: (id: string) => Promise<void>;
}

const SizeContext = createContext<SizeContextType | undefined>(undefined);

export const SizeProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [allData, setAllData] = useState<SizeData[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedSize[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const columns = [
    {
      key: "color_name",
      label: "Color",
    },
    {
      key: "size",
      label: "Size",
      render: (_value: any, row: { size: number }) => `${row.size} cm`,
    },
  ];

  const groupSizes = (data: SizeData[]) => {
    const grouped: Record<string, SizeData[]> = {};
    data.forEach((item) => {
      if (!grouped[item.color_name]) grouped[item.color_name] = [];
      grouped[item.color_name].push(item);
    });
    return Object.entries(grouped).map(([color_name, sizes]) => ({
      color_name,
      sizes,
    }));
  };

  const fetchData = useCallback(
    async (
      filter: string = searchValue,
      pageNum: number = page,
      color_id?: string
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());
        if (color_id) params.append("color_id", color_id);

        const res = await fetch(`/api/sizes/size?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          const mapped: SizeData[] = json.data.map((d: any) => ({
            id: d._id,
            color_id: d.color_id._id,
            color_name: d.color_id.color,
            size: d.size,
          }));

          setAllData(mapped);
          setGroupedData(groupSizes(mapped));
          setTotal(json.total);
        }
      } catch (err) {
        console.error("Failed to fetch sizes:", err);
        enqueueSnackbar("Failed to fetch sizes", { variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchValue, enqueueSnackbar]
  );

  const tableData = useMemo(() => {
    const rows: TableRow<any>[] = [];
    groupedData.forEach((group) => {
      group.sizes.forEach((size, index) => {
        rows.push({
          data: {
            color_name: index === 0 ? group.color_name : "",
            size: size.size,
            id: size.id,
            color_id: size.color_id,
          },
          actions: ["edit", "delete"],
        });
      });
    });
    return rows;
  }, [groupedData]);

  const addSize = async (color_id: string, size: number) => {
    try {
      const res = await fetch("/api/sizes/size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color_id, size }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add size");

      await fetchData("", 1);
      setPage(1);
      enqueueSnackbar(`Added size ${size} successfully`, {
        variant: "success",
      });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const updateSize = async (id: string, size: number, color_id: string) => {
    try {
      const res = await fetch("/api/sizes/size", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, size, color_id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update size");

      await fetchData("", page);
      enqueueSnackbar(`Updated size to ${size}`, { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const deleteSize = async (id: string) => {
    try {
      const res = await fetch(`/api/sizes/size?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete size");

      await fetchData("", page);
      enqueueSnackbar("Deleted size successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const handleAction = async (row: any, action: TableAction) => {
    if (action === "edit") {
      console.log("Edit", row);
    } else if (action === "delete") {
      const confirmed = window.confirm(
        `Are you sure you want to delete size ${row.size} of color ${row.color_name}?`
      );
      if (!confirmed) return;
      await deleteSize(row.id);
    }
  };

  useEffect(() => {
    fetchData("", page);
  }, [fetchData, page, pageSize]);

  return (
    <SizeContext.Provider
      value={{
        columns,
        allData,
        groupedData,
        tableData,
        loading,
        page,
        pageSize,
        total,
        searchValue,
        fetchData,
        setPage,
        setPageSize,
        setSearchValue,
        handleAction,
        addSize,
        updateSize,
        deleteSize,
      }}
    >
      {children}
    </SizeContext.Provider>
  );
};

export const useSizeContext = () => {
  const context = useContext(SizeContext);
  if (!context)
    throw new Error("useSizeContext must be used within a SizeProvider");
  return context;
};
