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
import { fetchChartData } from "../services/chartService";
import { formatRp } from "@/lib/formatRp";
import { formatNumber } from "@/lib/formatNumber";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataItem {
  date: string;
  in: number;
  out: number;
  adjust: number;
  sales: number;
}

interface DashboardChartProps {
  defaultStartDate: string;
  defaultEndDate: string;
}

export default function DashboardChart({
  defaultStartDate,
  defaultEndDate,
}: DashboardChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChart = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      const data = await fetchChartData(start, end);
      setChartData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChart(startDate, endDate);
  }, []);

  const labels = chartData.map((d) => d.date);

  const lineData = {
    labels,
    datasets: [
      {
        label: "Restock",
        data: chartData.map((d) => d.in),
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
      },
      {
        label: "Pengiriman",
        data: chartData.map((d) => d.out),
        borderColor: "#f87171",
        backgroundColor: "#f87171",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
      },
      {
        label: "Penjualan (Rp)",
        data: chartData.map((d) => d.sales),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
        yAxisID: "y1",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    animation: { duration: 800, easing: "easeOutQuart" },
    interaction: {
      mode: "nearest",
      intersect: true,
    },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value =
              context.dataset.label === "Penjualan (Rp)"
                ? formatRp(context.raw)
                : formatNumber(context.raw);
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Tanggal" } },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Qty" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Penjualan (Rp)" },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm relative">
      <h2 className="text-lg font-semibold mb-3">Tren Stok & Penjualan</h2>

      <div className="flex gap-2 items-center flex-wrap mb-4">
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={() => loadChart(startDate, endDate)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Filter"}
        </button>
        <button
          className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => {
            setStartDate(defaultStartDate);
            setEndDate(defaultEndDate);
            loadChart(defaultStartDate, defaultEndDate);
          }}
          disabled={loading}
        >
          Reset
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <p>Loading...</p>
        </div>
      )}
      <Line key={startDate + "-" + endDate} data={lineData} options={options} />
    </div>
  );
}
