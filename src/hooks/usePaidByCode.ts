"use client";

import { TableRow } from "@/components/table/Table";
import { formatNumber } from "@/lib/formatNumber";
import { formatRp } from "@/lib/formatRp";
import { useState, useCallback } from "react";

export interface DeliveryItem {
  color: string;
  size: number | null;
  weight: number | null;
  quantity: number;
  unit_price: number;
  discount_per_item: number;
  total_price: number;
  tokenHistory: string;
}

export interface DeliverySummary {
  delivery_id: string;
  code: string;
  customer_name: string;
  note: string;
  description: string;
  input_date: string;
  total_price: number;
  total_payment: number;
  status: "not_yet_paid" | "partially_paid" | "paid_off";
}

export interface PaymentItem {
  _id: string;
  type: string;
  name: string;
  amount: number;
  note?: string;
  status: "paid" | "pending";
}

export const usePaidByCode = (code: string) => {
  // data list delivery
  const [data, setData] = useState<TableRow<DeliveryItem>[]>([]);
  const [loading, setLoading] = useState(false);
  // data Summary
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summary, setSummary] = useState<DeliverySummary | null>(null);
  // data list payment
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const columns = [
    { key: "color", label: "Color" },
    {
      key: "size",
      label: "Size",
      render: (_v: any, row: DeliveryItem) => `${row.size} cm`,
    },
    {
      key: "weight",
      label: "Weight",
      render: (_v: any, row: DeliveryItem) => `${row.weight} g`,
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (_v: any, row: DeliveryItem) => formatNumber(row.quantity),
    },
    {
      key: "unit_price",
      label: "Unit Price",
      render: (_v: any, row: DeliveryItem) => formatRp(row.unit_price),
    },
    {
      key: "discount_per_item",
      label: "Discount",
      render: (_v: any, row: DeliveryItem) => formatRp(row.discount_per_item),
    },
    {
      key: "total_price",
      label: "Total Price",
      render: (_v: any, row: DeliveryItem) => formatRp(row.total_price),
    },
  ];

  const fetchDeliveryByCode = useCallback(
    async (pageNum: number = 1, pageSizeNum: number = pageSize) => {
      if (!code) return;

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("code", code);
        params.append("page", pageNum.toString());
        params.append("pageSize", pageSizeNum.toString());

        const res = await fetch(
          `/api/deliveries/getByCode?${params.toString()}`
        );
        const json = await res.json();

        if (json.success) {
          const rows: TableRow<DeliveryItem>[] = json.data.map(
            (item: DeliveryItem) => ({
              data: item,
              actions: [],
            })
          );

          setData(rows);
          setTotal(json.total);
          setPage(pageNum);
          setPageSize(pageSizeNum);
        }
      } catch (err) {
        console.error("Failed to fetch delivery items by code:", err);
      } finally {
        setLoading(false);
      }
    },
    [code, pageSize]
  );

  const fetchSummaryByCode = useCallback(async () => {
    if (!code) return;
    setLoadingSummary(true);

    try {
      const params = new URLSearchParams();
      params.append("code", code);

      const res = await fetch(
        `/api/deliveries/getDeliveryWithPayments?${params.toString()}`
      );
      const json = await res.json();

      if (json.success) {
        setSummary(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch delivery summary:", err);
    } finally {
      setLoadingSummary(false);
    }
  }, [code]);

  const fetchPaymentsByCode = useCallback(async () => {
    if (!code) return;

    setLoadingPayments(true);
    try {
      const params = new URLSearchParams();
      params.append("code", code);

      const res = await fetch(`/api/payments/payment?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setPayments(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoadingPayments(false);
    }
  }, [code]);

  return {
    columns,
    data,
    summary,
    payments,
    loading,
    page,
    loadingSummary,
    loadingPayments,
    pageSize,
    total,
    setPage,
    setPageSize,
    fetchDeliveryByCode,
    fetchSummaryByCode,
    fetchPaymentsByCode,
  };
};
