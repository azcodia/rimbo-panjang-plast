"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { TableRow } from "@/components/table/Table";
import { useSnackbar } from "notistack";
import { createTokenHistory } from "@/lib/createTokenHistory";
import { formatDate } from "@/lib/formatDate";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";

export interface DeliveryItem {
  stock_id: string;
  color_id: string;
  size_id: string;
  heavy_id: string;
  quantity: number;
  unit_price?: number;
  discount_per_item?: number;
  total_price?: number;
  tokenHistory?: string;
}

export interface Customer {
  _id: string;
  name: string;
  type: string;
}

export interface DeliveryData {
  _id?: string;
  code: string;
  customer_id: Customer | string;
  note?: string;
  description?: string;
  created_at: string;
  input_date: string;
  status: "paid" | "partially_paid" | "unpaid";
  items: DeliveryItem[];
}

interface DeliveryContextType {
  data: TableRow<DeliveryData>[];
  allData: DeliveryData[];
  page: number;
  setPage: (page: number) => void;
  columns: { key: string; label: string; render?: any }[];
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  total: number;
  loading: boolean;
  filterValue: string;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  isModalPaidOpen: boolean;
  setIsModalPaidOpen: (val: boolean) => void;
  selectedDelivery: string | null;
  setSelectedDelivery: (val: string | null) => void;
  isModalDetailDeliveryOpen: boolean;
  setIsModalDetailDeliveryOpen: (val: boolean) => void;
  handleFilter: (val: string) => void;
  handleActionClick: (
    row: DeliveryData,
    action: "paid" | "edit" | "delete" | "show"
  ) => void;
  fetchData: (filter?: string, page?: number) => Promise<void>;
  addDelivery: (
    delivery: Omit<DeliveryData, "_id" | "created_at">
  ) => Promise<void>;
  deleteDelivery: (id: string, code: string) => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(
  undefined
);

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<TableRow<DeliveryData>[]>([]);
  const [allData, setAllData] = useState<DeliveryData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPaidOpen, setIsModalPaidOpen] = useState(false);
  const [isModalDetailDeliveryOpen, setIsModalDetailDeliveryOpen] =
    useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const columns = [
    {
      key: "status",
      label: "Status Pembayaran",
      render: (_value: any, row: DeliveryData) => (
        <PaymentStatusBadge status={row.status} />
      ),
    },
    {
      key: "input_date",
      label: "Tanggal Transaksi",
      render: (_value: any, row: DeliveryData) => formatDate(row.input_date),
    },
    { key: "code", label: "Code" },
    {
      key: "customer_id",
      label: "Nama Pelanggan",
      render: (_value: any, row: DeliveryData) =>
        `${(row.customer_id as Customer).name} (${
          (row.customer_id as Customer).type
        })`,
    },
    { key: "note", label: "Catatan" },
    { key: "description", label: "Keterangan" },
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
        if (filter) params.append("code", filter);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(
          `/api/deliveries/delivery?${params.toString()}`
        );
        const json = await res.json();
        if (json.success) {
          const processedData: DeliveryData[] = json.data.map((item: any) => ({
            ...item,
            items: item.items.map((i: any) => ({
              ...i,
              tokenHistory: i.tokenHistory || "",
            })),
          }));

          setAllData(processedData);
          setData(
            processedData.map((item: DeliveryData) => ({
              data: item,
              actions: ["paid", "edit", "show", "delete"],
            }))
          );
          setTotal(json.total);
        }
      } catch (err) {
        console.error("Failed to fetch deliveries:", err);
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
    row: DeliveryData,
    action: "edit" | "delete" | "show" | "paid"
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete this delivery?`)) {
        deleteDelivery(row._id || "", row.code);
      }
    } else if (action === "paid") {
      setSelectedDelivery(row._id || "");
      setIsModalPaidOpen(true);
    } else if ((action = "show")) {
      setSelectedDelivery(row._id || "");
      setIsModalDetailDeliveryOpen(true);
    }
  };

  const addDelivery = async (
    delivery: Omit<DeliveryData, "_id" | "created_at">
  ) => {
    try {
      const token = getToken();
      if (!token) throw new Error("User not authenticated");
      const inputDate = delivery.input_date || new Date().toISOString();

      const itemsWithToken = delivery.items.map((item) => ({
        ...item,
        tokenHistory: createTokenHistory(),
      }));
      const res = await fetch("/api/deliveries/delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...delivery,
          items: itemsWithToken,
          input_date: inputDate,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add delivery");

      for (const item of itemsWithToken) {
        await fetch(`/api/stocks/stock`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stock_id: item.stock_id,
            quantityChange: -item.quantity,
          }),
        });

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
            type: "out",
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_per_item: item.discount_per_item || 0,
            total_price: item.total_price,
            customer_id: delivery.customer_id,
            note: `Delivery added`,
            tokenHistory: item.tokenHistory,
            input_date: inputDate,
          }),
        });
      }

      await fetchData();
      enqueueSnackbar("Delivery added successfully", { variant: "success" });
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  const deleteDelivery = async (deliveryId: string, code: string) => {
    try {
      const token = getToken();
      if (!token) throw new Error("User not authenticated");

      const resFetch = await fetch(
        `/api/deliveries/delivery?id=${deliveryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const jsonFetch = await resFetch.json();
      if (!resFetch.ok)
        throw new Error(jsonFetch.message || "Failed to fetch delivery");

      const deliveryArray = jsonFetch.data;
      if (!Array.isArray(deliveryArray) || deliveryArray.length === 0)
        throw new Error("Delivery not found");

      const delivery = deliveryArray[0];
      if (
        !delivery.items ||
        !Array.isArray(delivery.items) ||
        delivery.items.length === 0
      )
        throw new Error("Delivery items not found or invalid");

      for (const item of delivery.items) {
        await fetch(`/api/stocks/stock`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stock_id: item.stock_id._id || item.stock_id,
            quantityChange: item.quantity,
          }),
        });

        await fetch("/api/history-transactions/history-transaction", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tokenHistory: item.tokenHistory,
            note: `( Delivery "${code}" deleted by user )`,
          }),
        });
      }

      const resDelete = await fetch(
        `/api/deliveries/delivery?id=${deliveryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const jsonDelete = await resDelete.json();
      if (!resDelete.ok)
        throw new Error(jsonDelete.message || "Failed to delete delivery");

      await fetchData();
      enqueueSnackbar("Delivery deleted successfully", { variant: "success" });
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
    <DeliveryContext.Provider
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
        isModalPaidOpen,
        selectedDelivery,
        isModalDetailDeliveryOpen,
        setIsModalPaidOpen,
        setSelectedDelivery,
        setIsModalDetailDeliveryOpen,
        handleFilter,
        handleActionClick,
        fetchData,
        addDelivery,
        deleteDelivery,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveryContext = () => {
  const context = useContext(DeliveryContext);
  if (!context)
    throw new Error(
      "useDeliveryContext must be used within a DeliveryProvider"
    );
  return context;
};
