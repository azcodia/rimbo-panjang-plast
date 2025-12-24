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
export type CustomerType = "per/orang" | "warung";

export interface CustomerData {
  id: string;
  type: CustomerType;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
}

interface CustomerContextType {
  data: TableRow<CustomerData>[];
  allData: CustomerData[];
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
  editingRow: CustomerData | null;
  setEditingRow: (row: CustomerData | null) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  handleFilter: (val: string) => void;
  selectedCustomer: string | null;
  setSelectedCustomer: (val: string | null) => void;
  handleActionClick: (
    row: CustomerData,
    action: "edit" | "delete" | "show" | "paid"
  ) => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
  addCustomer: (customer: Partial<CustomerData>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  updateCustomer: (
    id: string,
    customer: Partial<CustomerData>
  ) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);
export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<CustomerData>[]>([]);
  const [allData, setAllData] = useState<CustomerData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState<CustomerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    { key: "type", label: "Type" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];

  const fetchData = useCallback(
    async (filter: string = filterValue, pageNum: number = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter) params.append("filter", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(`/api/customers/customer?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          const mappedData: CustomerData[] = json.data.map((d: any) => ({
            id: d._id,
            type: d.type,
            name: d.name,
            email: d.email,
            phone: d.phone,
            address: d.address,
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
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page, filterValue]
  );

  const selectOptions: SelectOption<string>[] = [
    ...allData.map((c) => ({
      label: `${c.name} (${c.type === "per/orang" ? "Per/orang" : "Warung"})`,
      value: c.id,
    })),
  ];

  const handleFilter = (val: string) => {
    setFilterValue(val);
    setPage(1);
    fetchData(val, 1);
  };

  const handleActionClick = (
    row: CustomerData,
    action: "edit" | "delete" | "show" | "paid"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
        deleteCustomer(row.id);
      }
    } else if (action === "edit") {
      setEditingRow(row);
      setIsEditModalOpen(true);
    } else if (action === "show") {
      alert(`${row.name}\nType: ${row.type}\nPhone: ${row.phone || "-"}`);
    }
  };

  const addCustomer = async (customer: Partial<CustomerData>) => {
    try {
      const res = await fetch("/api/customers/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add customer");
      await fetchData();
      enqueueSnackbar(`Added customer ${customer.name}`, {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const res = await fetch(`/api/customers/customer?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete customer");
      await fetchData();
      enqueueSnackbar("Deleted customer successfully", {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const updateCustomer = async (
    id: string,
    customer: Partial<CustomerData>
  ) => {
    try {
      const res = await fetch(`/api/customers/customer?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update customer");
      await fetchData();
      enqueueSnackbar(`Updated customer ${customer.name}`, {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchData(filterValue, page);
  }, [fetchData, page, pageSize, filterValue]);

  return (
    <CustomerContext.Provider
      value={{
        data,
        allData,
        selectOptions,
        page,
        setPage,
        columns,
        pageSize,
        setPageSize,
        selectedCustomer,
        setSelectedCustomer,
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
        addCustomer,
        deleteCustomer,
        updateCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context)
    throw new Error(
      "useCustomerContext must be used within a CustomerProvider"
    );
  return context;
};
