"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Heart, MessageSquare, Calendar, TrendingUp, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Heart,
  MessageSquare,
  Calendar
};

interface Stat {
  label: string;
  value: number;
  icon: keyof typeof iconMap;
  trend: string;
  color: string;
  iconBg: string;
  chartData: number[];
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    let raf: number;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (end - start) * easeOut));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return <>{count.toLocaleString()}</>;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const width = 100;
  const height = 30;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / max) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#gradient-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        return (
        <div 
          key={stat.label} 
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110", stat.iconBg)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {stat.trend}
            </div>
          </div>
          
          <div className="relative z-10 mt-5">
            <div className="text-3xl font-bold tracking-tight text-white">
              <AnimatedCounter target={stat.value} />
            </div>
            <div className="mt-1 text-sm font-medium text-zinc-400">{stat.label}</div>
          </div>
          
          <div className="relative z-10 mt-4 h-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
            <Sparkline data={stat.chartData} color={stat.color} />
          </div>
        </div>
        );
      })}
    </div>
  );
}