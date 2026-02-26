'use client';

import { useState } from 'react';

const USERS = [
  { id: 1, name: 'राम', email: 'ram@gmail.com', phone: '98XXXXXXXX', role: 'Customer', status: 'Active' },
  { id: 2, name: 'सीता', email: 'sita@gmail.com', phone: '97XXXXXXXX', role: 'Customer', status: 'Active' },
  { id: 3, name: 'हरि', email: 'hari@gmail.com', phone: '96XXXXXXXX', role: 'Vendor', status: 'Active' },
  { id: 4, name: 'गीता', email: 'gita@gmail.com', phone: '95XXXXXXXX', role: 'Customer', status: 'Inactive' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <select className="border rounded-lg px-4 py-2">
          <option>All Roles</option>
          <option>Customer</option>
          <option>Vendor</option>
          <option>Admin</option>
        </select>
        <select className="border rounded-lg px-4 py-2">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">User</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Contact</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{user.phone}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'Vendor' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700">Edit</button>
                    <button className="text-red-600 hover:text-red-700">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}