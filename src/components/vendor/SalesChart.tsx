'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Data {
  date: string;
  sales: number;
  orders: number;
}

interface Props {
  data: Data[];
}

export function SalesChart({ data }: Props) {
  if (data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data</div>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Sales']} />
          <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}