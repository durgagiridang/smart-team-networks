import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Store, 
  BarChart3, 
  User, 
  LogOut 
} from 'lucide-react';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { href: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/vendor/products', icon: Package, label: 'Products' },
    { href: '/vendor/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/vendor/showroom?vendorId=test123', icon: Store, label: 'Live Showroom' },
    { href: '/vendor/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/vendor/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen p-4 hidden md:block fixed left-0 top-0 bottom-0 z-50 border-r border-gray-200">
          <div className="mb-8 p-2">
            <h1 className="text-xl font-bold text-green-600 flex items-center">
              <Store className="w-6 h-6 mr-2" />
              Vendor Panel
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage Your Store</p>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all text-gray-700 group"
              >
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Link 
              href="/"
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-lg font-bold text-green-600 flex items-center">
            <Store className="w-5 h-5 mr-2" />
            Vendor Panel
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg">☰</button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-64 md:mt-0 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}