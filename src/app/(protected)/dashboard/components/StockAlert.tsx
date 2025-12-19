"use client";

import { useEffect, useState } from "react";
import {
  fetchStockAlert,
  StockAlertResponse,
} from "../services/stockAlertService";
import { formatNumber } from "@/lib/formatNumber";

export default function StockAlert() {
  const [data, setData] = useState<StockAlertResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalLow, setTotalLow] = useState(0);
  const threshold = 5000;

  const fetchAlert = async () => {
    setLoading(true);
    try {
      const result = await fetchStockAlert({ threshold });
      setData(result);
      setTotalLow(result.lowStock.length);
    } catch (err) {
      console.error("Failed to load stock alert:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlert();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded p-4 text-gray-500">
        Loading stock alert...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* LOW STOCK */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold mb-3">Stock Menipis</h3>
          <span className="text-xs bg-red-100 text-danger px-2 py-1 rounded">
            {totalLow} item
          </span>
        </div>

        {data.lowStock.length === 0 ? (
          <p className="text-sm text-success font-semibold">Semua stok aman</p>
        ) : (
          <div className="text-sm max-h-36 overflow-y-auto scrollbar-auto-hide">
            {/* Header */}
            <div className="flex justify-between font-bold border-b pb-1 mb-1 text-gray-700">
              <span className="w-1/4">Color</span>
              <span className="w-1/4">Size</span>
              <span className="w-1/4">Weight</span>
              <span className="w-1/4">Stock</span>
            </div>

            {/* Items */}
            <ul className="space-y-2">
              {data.lowStock.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between border-b pb-1"
                >
                  <span className="w-1/4">{item.color || "-"}</span>
                  <span className="w-1/4">{item.size ?? "-"}</span>
                  <span className="w-1/4">{item.heavy ?? "-"}</span>
                  <span className="w-1/4 font-medium text-danger">
                    {formatNumber(item.stock)} {item.unit || ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* DEAD STOCK / Quick Action */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold mb-3">Quick Action</h3>
        </div>
      </div>
    </div>
  );
}
