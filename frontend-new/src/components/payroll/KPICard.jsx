"use client";

const variantStyles = {
  primary: "border-blue-500/20 bg-blue-500/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
  warning: "border-amber-500/20 bg-amber-500/5",
  destructive: "border-red-500/20 bg-red-500/5",
};

const iconVariant = {
  primary: "text-blue-500 bg-blue-500/10",
  success: "text-emerald-500 bg-emerald-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  destructive: "text-red-500 bg-red-500/10",
};

export function KPICard({ title, value, icon: Icon, variant = "primary", trend, trendUp }) {
  return (
    <div className={`rounded-xl border p-4 transition hover:shadow-md ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconVariant[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className={`text-[10px] font-semibold ${trendUp ? "text-emerald-500" : "text-red-400"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  );
}
