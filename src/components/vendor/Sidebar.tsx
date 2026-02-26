'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/vendor/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/vendor/showroom', label: 'Showroom', icon: '🎥' },
  { href: '/vendor/products', label: 'Products', icon: '🛍️' },
  { href: '/vendor/orders', label: 'Orders', icon: '📦' },
  { href: '/vendor/profile', label: 'Profile', icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Vendor Panel</h2>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}