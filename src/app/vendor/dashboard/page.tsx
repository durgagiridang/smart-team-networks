'use client';

import { useEffect, useState } from 'react';
import { useVendorDashboard } from '@/hooks/useVendorDashboard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function DashboardPage() {
  const [vendorId, setVendorId] = useState('');
  
  useEffect(() => {
    const storedId = localStorage.getItem('vendorId');
    if (!storedId || storedId === 'test123') {
      localStorage.setItem('vendorId', '699e968b775b17d7892a3131');
      setVendorId('699e968b775b17d7892a3131');
    } else {
      setVendorId(storedId);
    }
  }, []);

  const { stats, recentOrders, chartData, loading, error, refetch } = useVendorDashboard(vendorId);

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-700 mb-4 text-lg">❌ {error}</p>
          <button 
            onClick={refetch}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Vendor Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-blue-600 font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{stats?.totalOrders || 0}</p>
          </div>
          
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-green-600 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-green-900 mt-1">
              Rs. {(stats?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-purple-600 font-medium">Products</p>
            <p className="text-3xl font-bold text-purple-900 mt-1">
              {stats?.activeProducts || 0}/{stats?.totalProducts || 0}
            </p>
          </div>
          
          <div className="bg-white border border-orange-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-orange-600 font-medium">Today Orders</p>
            <p className="text-3xl font-bold text-orange-900 mt-1">{stats?.todayOrders || 0}</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Sales Analytics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} name="Sales (Rs.)" />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🛒 Recent Orders</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-center py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500">कुनै अर्डर छैन</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-gray-500 text-xs">{order.phone}</div>
                    </td>
                    <td className="text-right py-4 px-4 font-medium">
                      Rs. {(order.amount || 0).toLocaleString()}
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}