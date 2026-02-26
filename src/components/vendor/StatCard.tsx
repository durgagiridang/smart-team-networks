interface Props {
  title: string;
  value: string | number;
  trend: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colors = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700'
};

export function StatCard({ title, value, trend, icon, color }: Props) {
  return (
    <div className={`rounded-lg border p-6 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-sm mt-2 opacity-70">{trend}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}