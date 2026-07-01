import { Home, UserCircle, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export function QuickActions({ isAgent }: { isAgent: boolean }) {
  const actions = [
    { href: "/properties", icon: Home, title: "Browse properties", desc: "Explore new listings", gradient: "from-indigo-500/20 to-purple-500/20", iconColor: "text-indigo-400" },
    { href: "/dashboard/profile", icon: UserCircle, title: "Edit profile", desc: "Update your info", gradient: "from-pink-500/20 to-rose-500/20", iconColor: "text-pink-400" }
  ];

  if (isAgent) {
    actions.push({ href: "/dashboard/properties", icon: Plus, title: "Add new property", desc: "List a new estate", gradient: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-base font-semibold text-white">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className={`group relative flex items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-br ${action.gradient} border border-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
              <action.icon className={`h-5 w-5 ${action.iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">{action.title}</div>
              <div className="text-xs text-zinc-400">{action.desc}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </Link>
        ))}
      </div>
    </div>
  );
}