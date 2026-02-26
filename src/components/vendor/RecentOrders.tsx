interface Order {
  id: string;
  customer: string;
  phone: string;
  amount: number;
  status: string;
  date: string;
}

interface Props {
  orders: Order[];
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function RecentOrders({ orders }: Props) {
  if (orders.length === 0) {
    return <p className="text-gray-500 text-center py-4">No orders yet</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-600 border-b">
          <tr>
            <th className="text-left py-2">Customer</th>
            <th className="text-right py-2">Amount</th>
            <th className="text-center py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-0">
              <td className="py-3">
                <div className="font-medium text-gray-900">{order.customer}</div>
                <div className="text-gray-500 text-xs">{order.phone}</div>
              </td>
              <td className="text-right font-medium">
                Rs. {order.amount.toLocaleString()}
              </td>
              <td className="text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[order.status] || 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}