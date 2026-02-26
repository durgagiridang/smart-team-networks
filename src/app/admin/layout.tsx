import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/admin/merchants', icon: '🏪', label: 'Merchants' },
    { href: '/admin/users', icon: '👥', label: 'Users' },
    { href: '/admin/orders', icon: '📦', label: 'Orders' },
    { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
    { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen p-4 hidden md:block fixed left-0 top-0 bottom-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-600">STN Admin</h1>
            <p className="text-sm text-gray-500">Super Admin Panel</p>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-700"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">STN Admin</h1>
          <button className="p-2">☰</button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-64 md:mt-0 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}