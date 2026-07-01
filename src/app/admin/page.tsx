import prisma from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, Home, MessageSquare, Calendar } from "lucide-react";

export default async function AdminOverviewPage() {
  const [users, properties, messages, appointments] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.message.count(),
    prisma.appointment.count()
  ]);

  const agents = await prisma.user.count({ where: { role: "AGENT" } });
  const admins = await prisma.user.count({ where: { role: "ADMIN" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
          Admin Overview
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Platform-wide statistics and management.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Users" value={users} icon={Users} />
        <StatsCard label="Total Properties" value={properties} icon={Home} />
        <StatsCard label="Messages" value={messages} icon={MessageSquare} />
        <StatsCard label="Appointments" value={appointments} icon={Calendar} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">Agents</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{agents}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">Admins</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{admins}</div>
        </div>
      </div>
    </div>
  );
}