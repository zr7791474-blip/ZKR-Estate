import { Calendar, MessageSquare, ArrowRight, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import type { SessionUser } from "@/types";

interface HeroSectionProps {
  user: SessionUser;
  appointmentsCount: number;
  messagesCount: number;
}

export function HeroSection({ user, appointmentsCount, messagesCount }: HeroSectionProps) {
  const currentDate = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-500/20 blur-[100px]" />
      
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <span className="text-sm font-medium text-brand-400">Dashboard Overview</span>
          </div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-white md:text-4xl">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-base text-zinc-400">
            {currentDate} • Here's what's happening with your account today.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 text-brand-400" /> 
              <span>{appointmentsCount} Appointments</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm">
              <MessageSquare className="h-3.5 w-3.5 text-accent-400" /> 
              <span>{messagesCount} Messages</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/properties" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
            Browse Properties <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/properties" className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 active:scale-95">
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" /> Add Property
          </Link>
        </div>
      </div>
    </div>
  );
}