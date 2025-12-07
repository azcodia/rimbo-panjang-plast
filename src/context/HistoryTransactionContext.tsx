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

export interface HistoryTransactionData {
  id: string;
  stock_id: string;
  color_id: string;
  size_id: string;
  heavy_id: string;
  type: "in" | "out";
  quantity: number;
  note: string;
  user_id: string;
  created_at: string;
}

interface HistoryTransactionContextType {
  data: TableRow<HistoryTransactionData>[];
  allData: HistoryTransactionData[];
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
  handleFilter: (val: string) => void;
  handleActionClick: (row: HistoryTransactionData, action: "show") => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
}

const HistoryTransactionContext = createContext<
  HistoryTransactionContextType | undefined
>(undefined);

export const HistoryTransactionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<HistoryTransactionData>[]>([]);
  const [allData, setAllData] = useState<HistoryTransactionData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const columns = [
    { key: "color_id", label: "Color" },
    { key: "size_id", label: "Size" },
    { key: "heavy_id", label: "Heavy" },
    { key: "type", label: "Type" },
    { key: "quantity", label: "Quantity" },
    { key: "note", label: "Note" },
    { key: "user_id", label: "User" },
    { key: "created_at", label: "Created At" },
  ];

  const fetchData = useCallback(
    async (filter: string = filterValue, pageNum: number = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(
          `/api/history/history-transaction?${params.toString()}`
        );
        const json = await res.json();

        if (json.success) {
          const mappedData: HistoryTransactionData[] = json.data.map(
            (d: any) => ({
              id: d._id,
              stock_id: d.stock_id?._id || d.stock_id,
              color_id: d.color_id?._id || d.color_id,
              size_id: d.size_id?._id || d.size_id,
              heavy_id: d.heavy_id?._id || d.heavy_id,
              type: d.type,
              quantity: d.quantity,
              note: d.note,
              user_id: d.user_id?._id || d.user_id,
              created_at: d.created_at,
            })
          );
          setAllData(mappedData);
          setData(
            mappedData.map((item) => ({
              data: item,
              actions: ["show"],
            }))
          );
          setTotal(json.total);
        }
      } catch (err) {
        console.error("Failed to fetch history transactions:", err);
        enqueueSnackbar("Failed to fetch history transactions", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [filterValue, page, pageSize, enqueueSnackbar]
  );

  const handleFilter = (val: string) => {
    setFilterValue(val);
    setPage(1);
    fetchData(val, 1);
  };

  const handleActionClick = (row: HistoryTransactionData, action: "show") => {
    if (action === "show") {
      alert(
        `Transaction details:\nColor: ${row.color_id}\nSize: ${row.size_id}\nHeavy: ${row.heavy_id}\nType: ${row.type}\nQuantity: ${row.quantity}\nNote: ${row.note}\nUser: ${row.user_id}\nCreated At: ${row.created_at}`
      );
    }
  };

  useEffect(() => {
    fetchData(filterValue, page);
  }, [fetchData, page, pageSize, filterValue]);

  const selectOptions: SelectOption<string>[] = [
    { label: "All", value: "" },
    ...allData.map((d) => ({
      label: `${d.color_id}-${d.size_id}-${d.heavy_id} (${d.type})`,
      value: d.id,
    })),
  ];

  return (
    <HistoryTransactionContext.Provider
      value={{
        data,
        allData,
        selectOptions,
        page,
        setPage,
        columns,
        pageSize,
        setPageSize,
        totalPages: Math.ceil(total / pageSize),
        total,
        loading,
        filterValue,
        handleFilter,
        handleActionClick,
        fetchData,
      }}
    >
      {children}
    </HistoryTransactionContext.Provider>
  );
};

export const useHistoryTransactionContext = () => {
  const context = useContext(HistoryTransactionContext);
  if (!context)
    throw new Error(
      "useHistoryTransactionContext must be used within a HistoryTransactionProvider"
    );
  return context;
};
