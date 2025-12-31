"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useEffect, useState } from "react";
import { fetchCustomerPaymentChart } from "../../../services/customerDetail/customerPaymentChart";
import { formatRp } from "@/lib/formatRp";
import LoadingSpinner from "@/components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PaymentChartProps {
  customerId: string;
}

export default function PaymentChart({ customerId }: PaymentChartProps) {
  const today = new Date().toISOString().split("T")[0];
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState(
    oneMonthAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChart = async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await fetchCustomerPaymentChart(customerId, start, end);
      setData(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load chart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!customerId || !startDate || !endDate) return;

    const timeout = setTimeout(() => {
      loadChart(startDate, endDate);
    }, 300);

    return () => clearTimeout(timeout);
  }, [customerId, startDate, endDate]);

  const lineData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Uang Diterima (Rp)",
        data: data?.total_paid || [],
        borderColor: "#cd0f09",
        backgroundColor: "#cd0f09",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 15,
        yAxisID: "yPrice",
      },
      {
        label: "Total Harga Barang (Rp)",
        data: data?.total_unpaid || [],
        borderColor: "#7bb927",
        backgroundColor: "#7bb927",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 15,
        yAxisID: "yPrice",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    interaction: {
      mode: "nearest",
      intersect: true,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${formatRp(context.raw)}`,
        },
      },
    },
    scales: {
      yPrice: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Amount (Rp)",
        },
        ticks: {
          callback: (value: any) => formatRp(Number(value)),
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Tren Pembayaran</h2>

      <div className="flex gap-2 items-center flex-wrap mb-4">
        <div>
          <label className="block text-xs font-medium mb-0.5">
            Dari Tanggal
          </label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-0.5">
            Sampai Tanggal
          </label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {data && (
        <div className="relative h-[30.5rem]">
          <Line
            key={`${startDate}-${endDate}`}
            data={lineData}
            options={options}
          />
        </div>
      )}
    </div>
  );
}
