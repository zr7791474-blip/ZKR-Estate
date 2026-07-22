import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  className
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:-translate-y-1",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20 transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              {trend}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold tracking-tight text-white">
          {value}
        </div>
        <div className="mt-1 text-sm font-medium text-zinc-400">
          {label}
        </div>
      </div>
    </div>
  );
}