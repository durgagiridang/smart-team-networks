'use client';

import { useState } from 'react';

const ORDERS = [
  { id: '#001', customer: 'राम', merchant: 'मोमो हाउस', items: 3, amount: 450, status: 'Delivered', date: '2024-02-24' },
  { id: '#002', customer: 'सीता', merchant: 'पिज्जा हट', items: 2, amount: 890, status: 'Processing', date: '2024-02-24' },
  { id: '#003', customer: 'हरि', merchant: 'बर्गर किङ', items: 1, amount: 320, status: 'Pending', date: '2024-02-23' },
  { id: '#004', customer: 'गीता', merchant: 'चाउमिन पोइन्ट', items: 4, amount: 680, status: 'Delivered', date: '2024-02-23' },
  { id: '#005', customer: 'श्याम', merchant: 'मोमो हाउस', items: 2, amount: 340, status: 'Cancelled', date: '2024-02-22' },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: '456', color: 'blue' },
          { label: 'Pending', value: '23', color: 'yellow' },
          { label: 'Processing', value: '45', color: 'purple' },
          { label: 'Delivered', value: '388', color: 'green' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2 overflow-x-auto">
        {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
              filter === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Order ID</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Customer</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Merchant</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Items</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4 text-gray-600">{order.merchant}</td>
                <td className="p-4">{order.items}</td>
                <td className="p-4 font-medium">Rs. {order.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{order.date}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:text-blue-700">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}