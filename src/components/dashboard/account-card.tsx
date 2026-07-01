import { Settings, CheckCircle2, Calendar } from "lucide-react";
import Link from "next/link";
import type { SessionUser } from "@/types";

export function AccountCard({ user }: { user: SessionUser }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white shadow-lg shadow-brand-500/20 ring-4 ring-white/5">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#09090B] bg-emerald-500">
            <CheckCircle2 className="h-3 w-3 text-white" />
          </div>
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">{user.name}</h3>
        <p className="text-xs text-zinc-400">{user.email}</p>
        <span className="mt-2 inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
          {user.role}
        </span>
      </div>

      <div className="mt-6 space-y-3 border-t border-white/5 pt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Profile Completion</span>
          <span className="font-semibold text-white">85%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500" />
        </div>
        <div className="flex items-center justify-between text-xs pt-2">
          <span className="flex items-center gap-1.5 text-zinc-400"><Calendar className="h-3 w-3" /> Member since</span>
          <span className="font-medium text-zinc-300">2024</span>
        </div>
      </div>

      <Link href="/dashboard/profile" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20">
        <Settings className="h-3.5 w-3.5" /> Edit Profile
      </Link>
    </div>
  );
}