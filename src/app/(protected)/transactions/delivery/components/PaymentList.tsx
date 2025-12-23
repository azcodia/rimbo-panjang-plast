"use client";

import { formatRp } from "@/lib/formatRp";
import { Trash2 } from "lucide-react";

interface Payment {
  _id: string;
  name: string;
  amount: number;
  note?: string;
  status: "paid" | "pending";
}

interface Props {
  payments: Payment[];
  onDelete: (id: string) => void;
}

export default function PaymentList({ payments, onDelete }: Props) {
  if (!payments.length) {
    return (
      <div className="rounded-md border p-4 text-sm text-gray-500">
        Belum ada pembayaran
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <p className="font-semibold mb-3">Riwayat Pembayaran</p>

      <div className="space-y-2 overflow-y-auto scrollbar-auto-hide h-[24rem]">
        {payments.map((p) => (
          <div
            key={p._id}
            className="flex justify-between items-center border rounded-md px-3 py-2 text-sm group"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-gray-500 text-xs">{p.note || "-"}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">{formatRp(p.amount)}</p>
                <p
                  className={`text-[11px] ${
                    p.status === "paid" ? "text-green-600" : "text-orange-500"
                  }`}
                >
                  {p.status === "paid" ? "Dibayar" : "Belum Dibayar"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onDelete(p._id)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                title="Hapus pembayaran"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
