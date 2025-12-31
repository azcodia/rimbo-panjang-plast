"use client";

import { useEffect, useState } from "react";
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
import { Line } from "react-chartjs-2";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  fetchCustomerColorDemandChart,
  CustomerColorDemandChartData,
} from "../../../services/customerDetail/demand/fetchCustomerColorDemandChart";
import { getColorGrafik } from "@/lib/getColorGrafik";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CustomerColorChartProps {
  customerId: string;
}

export default function CustomerColorChart({
  customerId,
}: CustomerColorChartProps) {
  const today = new Date().toISOString().split("T")[0];
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState(
    oneMonthAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<CustomerColorDemandChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChart = async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await fetchCustomerColorDemandChart(customerId, start, end);
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
    datasets:
      data?.series.map((serie, index) => ({
        label: serie.label,
        data: serie.data,
        borderColor: getColorGrafik(index),
        backgroundColor: getColorGrafik(index),
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 15,
      })) || [],
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
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantity",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
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

      {loading && (
        <div className="flex justify-center items-center h-[15rem]">
          <LoadingSpinner size={8} color="text-primary" />
        </div>
      )}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {!loading && data && (
        <div className="relative h-[15.3rem]">
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
