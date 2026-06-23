interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  valueColor?: string;
}

export default function MetricCard({
  label,
  value,
  sub,
  accent = false,
  valueColor,
}: MetricCardProps) {
  if (accent) {
    return (
      <div className="bg-blue-700 rounded-xl p-4">
        <p className="text-xs text-blue-200 mb-1">{label}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {sub && <p className="text-xs text-blue-300 mt-1">{sub}</p>}
      </div>
    );
  }

  return (
    <div className="bg-slate-100 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${valueColor || "text-slate-900"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
