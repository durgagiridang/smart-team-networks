'use client';

import { useState } from 'react';

export default function VendorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Store Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl text-white shadow-lg">
            🏪
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">मेरो रेस्टुरेन्ट</h2>
            <p className="text-gray-600 mt-1">Fast Food • Kathmandu</p>
            <p className="text-sm text-gray-500 mt-1">Member since 2024</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="md:ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input 
              type="text" 
              defaultValue="मेरो रेस्टुरेन्ट"
              disabled={!isEditing}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              type="text" 
              defaultValue="98XXXXXXXX"
              disabled={!isEditing}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              defaultValue="restaurant@email.com"
              disabled={!isEditing}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input 
              type="text" 
              defaultValue="Kathmandu, Nepal"
              disabled={!isEditing}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600 font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              defaultValue="Best fast food in town. We serve delicious momo, chowmein, and more!"
              disabled={!isEditing}
              rows={4}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Store Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-bold text-gray-900">Open Hours</p>
              <p className="text-sm text-gray-600 mt-1">9:00 AM - 9:00 PM</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium px-4 py-2 hover:bg-green-50 rounded-lg transition-colors">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-bold text-gray-900">Delivery Radius</p>
              <p className="text-sm text-gray-600 mt-1">5 km</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium px-4 py-2 hover:bg-green-50 rounded-lg transition-colors">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-bold text-gray-900">Minimum Order</p>
              <p className="text-sm text-gray-600 mt-1">Rs. 200</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium px-4 py-2 hover:bg-green-50 rounded-lg transition-colors">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-bold text-gray-900">Delivery Fee</p>
              <p className="text-sm text-gray-600 mt-1">Rs. 50</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium px-4 py-2 hover:bg-green-50 rounded-lg transition-colors">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl shadow-sm p-6 border border-red-200">
        <h2 className="text-lg font-bold text-red-700 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">Delete Store Account</p>
            <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}