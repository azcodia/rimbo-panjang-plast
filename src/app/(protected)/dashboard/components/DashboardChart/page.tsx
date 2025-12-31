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
import { fetchChartData } from "../../services/chartService";
import { formatRp } from "@/lib/formatRp";
import { formatNumber } from "@/lib/formatNumber";
import Button from "@/components/ui/Button";
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

interface ChartDataItem {
  date: string;
  in: number;
  out: number;
  total_price: number;
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
        label: "Barang Masuk (Qty)",
        data: chartData.map((d) => d.in),
        borderColor: "#2098d5",
        backgroundColor: "#2098d5",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 20,
        yAxisID: "yQty",
      },
      {
        label: "Barang Keluar (Qty)",
        data: chartData.map((d) => d.out),
        borderColor: "#8a2be2",
        backgroundColor: "#8a2be2",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
        yAxisID: "yQty",
      },
      {
        label: "Total Harga Barang (Rp)",
        data: chartData.map((d) => d.total_price),
        borderColor: "#7bb927",
        backgroundColor: "#7bb927",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
        yAxisID: "yPrice",
      },
      {
        label: "Uang Diterima (Rp)",
        data: chartData.map((d) => d.sales),
        borderColor: "#cd0f09",
        backgroundColor: "#cd0f09",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
        yAxisID: "yPrice",
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
            const value = label.includes("Rp")
              ? formatRp(context.raw)
              : formatNumber(context.raw);
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Tanggal Transaksi" } },
      yQty: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Jumlah Barang (Qty)" },
      },
      yPrice: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Penjualan / Total Harga (Rp)" },
        ticks: {
          callback: (value: any) => formatRp(Number(value)),
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm relative">
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
        <div className="flex flex-row items-center w-64 gap-4">
          <Button
            onClick={() => loadChart(startDate, endDate)}
            loading={loading}
            text={loading ? "Loading..." : "Filter"}
          />
          <Button
            type="button"
            text="Reset"
            onClick={() => {
              setStartDate(defaultStartDate);
              setEndDate(defaultEndDate);
              loadChart(defaultStartDate, defaultEndDate);
            }}
            className="bg-gray-200 text-black hover:bg-gray-300"
          />
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {error && <p className="text-red-500 mb-2">Error: {error}</p>}

      <Line key={startDate + "-" + endDate} data={lineData} options={options} />
    </div>
  );
}
