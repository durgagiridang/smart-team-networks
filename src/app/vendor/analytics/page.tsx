export default function VendorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Store Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">Rs. 12,500</p>
          <p className="text-sm text-green-600 mt-2 font-medium">+15% from yesterday</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Orders</h3>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-sm text-green-600 mt-2 font-medium">+8% from yesterday</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Avg. Order Value</h3>
          <p className="text-3xl font-bold text-gray-900">Rs. 520</p>
          <p className="text-sm text-red-600 mt-2 font-medium">-2% from yesterday</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Revenue</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-gray-600 font-medium">Chart Integration Needed</p>
              <p className="text-sm text-gray-400 mt-1">Connect with Chart.js or Recharts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {[
              { name: 'मोमो', orders: 45, revenue: 'Rs. 5,400', percent: 90 },
              { name: 'चाउमिन', orders: 38, revenue: 'Rs. 5,700', percent: 75 },
              { name: 'बर्गर', orders: 32, revenue: 'Rs. 6,400', percent: 65 },
              { name: 'पिज्जा', orders: 28, revenue: 'Rs. 12,600', percent: 55 },
            ].map((product, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="font-bold text-gray-900">{product.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${product.percent}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{product.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">Rs. 3,45,000</p>
            <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">678</p>
            <p className="text-sm text-gray-600 mt-1">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600 mt-1">New Customers</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600 mt-1">Avg. Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}