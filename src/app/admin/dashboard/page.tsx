'use client';

import { useState } from 'react';

// Demo stats data
const STATS = [
  { title: 'Total Merchants', value: '24', change: '+12%', icon: '🏪', color: 'blue' },
  { title: 'Total Users', value: '1,234', change: '+8%', icon: '👥', color: 'green' },
  { title: 'Total Orders', value: '456', change: '+23%', icon: '📦', color: 'purple' },
  { title: 'Revenue', value: 'Rs. 1,25,000', change: '+15%', icon: '💰', color: 'yellow' },
];

const RECENT_ORDERS = [
  { id: '#001', customer: 'राम', merchant: 'मोमो हाउस', amount: 450, status: 'Delivered' },
  { id: '#002', customer: 'सीता', merchant: 'पिज्जा हट', amount: 890, status: 'Processing' },
  { id: '#003', customer: 'हरि', merchant: 'बर्गर किङ', amount: 320, status: 'Pending' },
  { id: '#004', customer: 'गीता', merchant: 'चाउमिन पोइन्ट', amount: 280, status: 'Delivered' },
];

const TOP_MERCHANTS = [
  { name: 'मोमो हाउस', orders: 156, revenue: 'Rs. 45,000' },
  { name: 'पिज्जा हट', orders: 134, revenue: 'Rs. 38,500' },
  { name: 'बर्गर किङ', orders: 98, revenue: 'Rs. 28,900' },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('today');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin!</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last period</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Merchant</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3 text-gray-600">{order.merchant}</td>
                    <td className="p-3 font-medium">Rs. {order.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top Merchants</h2>
          <div className="space-y-4">
            {TOP_MERCHANTS.map((merchant, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{merchant.name}</p>
                  <p className="text-sm text-gray-500">{merchant.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{merchant.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Merchant
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            + Add User
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            View Reports
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            System Settings
          </button>
        </div>
      </div>
    </div>
  );
}