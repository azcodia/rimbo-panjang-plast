"use client";

import { useEffect, useState } from "react";
import {
  fetchRecentTransactions,
  Transaction,
} from "../services/recentTransactionService";

interface TransactionItem {
  color?: string;
  size?: number;
  heavy?: number;
  quantity: number;
  unit_price?: number;
  discount_per_item?: number;
  total_price: number;
  note: string;
}

interface TransactionWithItems {
  id: string;
  code?: string;
  customer?: string;
  input_date: string;
  type: "in" | "out" | "adjust";
  items: TransactionItem[];
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecentTransactions({ limit: 10 });

        // Grouping by code
        const grouped: TransactionWithItems[] = Object.values(
          data.reduce((acc: Record<string, TransactionWithItems>, tx) => {
            if (!acc[tx.code || tx.id]) {
              acc[tx.code || tx.id] = {
                id: tx.id,
                code: tx.code,
                customer: tx.customer,
                input_date: tx.input_date,
                type: tx.type,
                items: [],
              };
            }
            acc[tx.code || tx.id].items.push({
              color: tx.color,
              size: tx.size,
              heavy: tx.heavy,
              quantity: tx.quantity,
              unit_price: tx.unit_price,
              discount_per_item: tx.discount_per_item,
              total_price: tx.total_price,
              note: tx.note,
            });
            return acc;
          }, {})
        );

        setTransactions(grouped);
      } catch (err) {
        console.error("Failed to fetch recent transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Color</th>
                <th className="p-2 text-left">Size</th>
                <th className="p-2 text-left">Weight</th>
                <th className="p-2 text-right">Quantity</th>
                <th className="p-2 text-right">Unit Price</th>
                <th className="p-2 text-right">Discount</th>
                <th className="p-2 text-right">Total Price</th>
                <th className="p-2 text-left">Note</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) =>
                tx.items.map((item, idx) => (
                  <tr
                    key={`${tx.id}-${idx}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2">{idx === 0 ? tx.code : ""}</td>
                    <td className="p-2">{idx === 0 ? tx.customer : ""}</td>
                    <td className="p-2">
                      {idx === 0
                        ? new Date(tx.input_date).toLocaleDateString("en-US")
                        : ""}
                    </td>
                    <td className="p-2">{item.color || "-"}</td>
                    <td className="p-2">{item.size ?? "-"}</td>
                    <td className="p-2">{item.heavy ?? "-"}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">
                      {item.unit_price?.toLocaleString() ?? "-"}
                    </td>
                    <td className="p-2 text-right">
                      {item.discount_per_item?.toLocaleString() ?? "0"}
                    </td>
                    <td className="p-2 text-right">
                      {item.total_price.toLocaleString()}
                    </td>
                    <td className="p-2">{item.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
