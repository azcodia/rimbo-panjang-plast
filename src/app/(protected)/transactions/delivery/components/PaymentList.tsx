"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { formatRekening } from "@/lib/formatCardNumber";
import { formatRp } from "@/lib/formatRp";
import { Trash2 } from "lucide-react";

interface Payment {
  _id: string;
  name: string;
  account_number: string;
  amount: number;
  note?: string;
  input_date?: string;
}

interface Props {
  payments: Payment[];
  onDelete: (id: string) => void;
  loading?: boolean;
  justShow?: boolean;
}

export default function PaymentList({ payments, onDelete, loading }: Props) {
  if (loading) {
    return (
      <div className="h-[28.3rem] flex items-center justify-center rounded-md border bg-white p-4 shadow-sm">
        <LoadingSpinner size={8} color="text-gray-500" />
      </div>
    );
  }

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
              <p className="font-medium">
                {p.name}{" "}
                {p.account_number && ` - ${formatRekening(p.account_number)}`}
              </p>

              <p className="text-gray-500 text-[10px] italic">
                {p.note || "-"}
              </p>

              {p.input_date && (
                <p className="text-gray-500 font-medium text-[9px] mt-0.5">
                  {new Date(p.input_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">{formatRp(p.amount)}</p>
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
