'use client';

import { useState } from 'react';

const ORDERS = [
  { id: '#V001', customer: 'राम', phone: '98XXXXXXXX', items: 3, amount: 450, status: 'New', time: '2 min ago', avatar: 'र' },
  { id: '#V002', customer: 'सीता', phone: '97XXXXXXXX', items: 2, amount: 890, status: 'Preparing', time: '15 min ago', avatar: 'सी' },
  { id: '#V003', customer: 'हरि', phone: '96XXXXXXXX', items: 1, amount: 320, status: 'Ready', time: '30 min ago', avatar: 'ह' },
  { id: '#V004', customer: 'गीता', phone: '95XXXXXXXX', items: 4, amount: 680, status: 'Delivered', time: '1 hour ago', avatar: 'गी' },
];

export default function VendorOrdersPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New', value: '5', color: 'bg-red-100 text-red-700' },
          { label: 'Preparing', value: '8', color: 'bg-yellow-100 text-yellow-700' },
          { label: 'Ready', value: '3', color: 'bg-blue-100 text-blue-700' },
          { label: 'Delivered', value: '140', color: 'bg-green-100 text-green-700' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2 overflow-x-auto">
        {['all', 'new', 'preparing', 'ready', 'delivered'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap font-medium ${
              filter === tab ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ORDERS.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                  {order.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{order.customer}</p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                </div>
              </div>
              
              {/* Order Info */}
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">{order.items} items</p>
                <p className="text-xl font-bold text-gray-900">Rs. {order.amount}</p>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === 'New' ? 'bg-red-100 text-red-700' :
                  order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {order.status}
                </span>
                
                {order.status !== 'Delivered' && (
                  <select className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                    <option>Update Status</option>
                    <option>Preparing</option>
                    <option>Ready</option>
                    <option>Delivered</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}