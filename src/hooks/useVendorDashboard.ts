
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Stats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalProducts: number;
  activeProducts: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  phone: string;
  amount: number;
  status: string;
  date: string;
}

interface ChartData {
  date: string;
  sales: number;
  orders: number;
}

interface DashboardData {
  stats: Stats;
  recentOrders: RecentOrder[];
}

export function useVendorDashboard(vendorId: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, chartRes] = await Promise.all([
          fetch(`http://localhost:8000/api/vendor/dashboard/stats/${vendorId}`),
          fetch(`http://localhost:8000/api/vendor/dashboard/chart/${vendorId}`)
        ]);

        if (!statsRes.ok || !chartRes.ok) {
          throw new Error('API request failed');
        }

        const statsJson = await statsRes.json();
        const chartJson = await chartRes.json();

        if (statsJson.success) {
          setData(statsJson.data);
        } else {
          throw new Error(statsJson.message);
        }

        if (chartJson.success) {
          setChartData(chartJson.data);
        }
      } catch (err: any) {
        const msg = err.message || 'ड्यासबोर्ड लोड गर्न असफल';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const refetch = () => {
    window.location.reload();
  };

  return {
    stats: data?.stats,
    recentOrders: data?.recentOrders || [],
    chartData,
    loading,
    error,
    refetch
  };
}