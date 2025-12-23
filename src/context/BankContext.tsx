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

export type BankType = "cash" | "bank";

export interface BankData {
  id: string;
  type: BankType;
  name: string;
  account_name?: string;
  account_number?: string;
  note?: string;
}

interface BankContextType {
  data: TableRow<BankData>[];
  allData: BankData[];
  cashBankOptions: SelectOption<string>[];
  transferBankOptions: SelectOption<string>[];
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
  editingRow: BankData | null;
  setEditingRow: (row: BankData | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  handleFilter: (val: string) => void;
  selectedBank: string | null;
  setSelectedBank: (val: string | null) => void;
  handleActionClick: (
    row: BankData,
    action: "edit" | "delete" | "show" | "paid"
  ) => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
  addBank: (bank: Partial<BankData>) => Promise<void>;
  deleteBank: (id: string) => Promise<void>;
  updateBank: (id: string, bank: Partial<BankData>) => Promise<void>;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<BankData>[]>([]);
  const [allData, setAllData] = useState<BankData[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(200);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState<BankData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    { key: "type", label: "Type" },
    { key: "name", label: "Name" },
    { key: "account_name", label: "Account Name" },
    { key: "account_number", label: "Account Number" },
  ];

  const fetchData = useCallback(
    async (filter: string = filterValue, pageNum: number = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(`/api/banks/bank?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          const mappedData: BankData[] = json.data.map((d: any) => ({
            id: d._id,
            type: d.type,
            name: d.name,
            account_name: d.account_name,
            account_number: d.account_number,
            note: d.note,
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
        console.error("Failed to fetch banks:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page, filterValue]
  );

  const selectOptions: SelectOption<string>[] = allData.map((b) => ({
    label: `${b.name} (${b.type === "cash" ? "Cash" : "Bank"})`,
    value: b.id,
  }));

  const handleFilter = (val: string) => {
    setFilterValue(val);
    setPage(1);
    fetchData(val, 1);
  };

  const handleActionClick = (
    row: BankData,
    action: "edit" | "delete" | "show" | "paid"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
        deleteBank(row.id);
      }
    } else if (action === "edit") {
      setEditingRow(row);
      setIsEditModalOpen(true);
    } else if (action === "show") {
      alert(
        `${row.name}\nType: ${row.type}\nAccount: ${row.account_number || "-"}`
      );
    }
  };

  const addBank = async (bank: Partial<BankData>) => {
    try {
      const res = await fetch("/api/banks/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bank),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add bank");
      await fetchData();
      enqueueSnackbar(`Added bank ${bank.name}`, { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const deleteBank = async (id: string) => {
    try {
      const res = await fetch(`/api/banks/bank?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete bank");
      await fetchData();
      enqueueSnackbar("Deleted bank successfully", {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const updateBank = async (id: string, bank: Partial<BankData>) => {
    try {
      const res = await fetch(`/api/banks/bank?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bank),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update bank");
      await fetchData();
      enqueueSnackbar(`Updated bank ${bank.name}`, {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const cashBankOptions = useMemo(
    () =>
      allData
        .filter((b) => b.type === "cash")
        .map((b) => ({ value: b.id, label: b.name })),
    [allData]
  );

  const transferBankOptions = useMemo(
    () =>
      allData
        .filter((b) => b.type === "bank")
        .map((b) => ({
          value: b.id,
          label: b.account_number ? `${b.name} (${b.account_number})` : b.name,
        })),
    [allData]
  );

  useEffect(() => {
    fetchData(filterValue, page);
  }, [fetchData, page, pageSize, filterValue]);

  return (
    <BankContext.Provider
      value={{
        data,
        allData,
        selectOptions,
        cashBankOptions,
        transferBankOptions,
        page,
        setPage,
        columns,
        pageSize,
        setPageSize,
        selectedBank,
        setSelectedBank,
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
        addBank,
        deleteBank,
        updateBank,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBankContext = () => {
  const context = useContext(BankContext);
  if (!context)
    throw new Error("useBankContext must be used within a BankProvider");
  return context;
};
