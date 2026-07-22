import prisma from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ChartsGrid } from "@/components/dashboard/charts-grid";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Users, Home, MessageSquare, Calendar, ShieldCheck, UserCog } from "lucide-react";

function generateChartData(records: { createdAt: Date }[], days: number = 30) {
  const data = Array(days).fill(0);
  const now = new Date();
  records.forEach((r) => {
    const diff = Math.floor((now.getTime() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < days) data[days - 1 - diff]++;
  });
  return data;
}

export default async function AdminOverviewPage() {
  const [users, properties, messages, appointments, agents, admins] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.message.count(),
    prisma.appointment.count(),
    prisma.user.count({ where: { role: "AGENT" } }),
    prisma.user.count({ where: { role: "ADMIN" } })
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [recentProperties, recentAppointments, recentUsers, recentMessages] = await Promise.all([
    prisma.property.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.appointment.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, createdAt: true, property: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.message.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ]);

  const activities = [
    ...recentProperties.map((p) => ({ id: p.id, type: "property" as const, title: "Property Listed", description: p.title, timestamp: p.createdAt })),
    ...recentAppointments.map((a) => ({ id: a.id, type: "appointment" as const, title: "Appointment Booked", description: a.property.title, timestamp: a.createdAt })),
    ...recentUsers.map((u) => ({ id: u.id, type: "favorite" as const, title: "New Signup", description: u.name, timestamp: u.createdAt })),
    ...recentMessages.map((m) => ({ id: m.id, type: "message" as const, title: "New Message", description: m.content.slice(0, 40) + (m.content.length > 40 ? "…" : ""), timestamp: m.createdAt }))
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight text-white">
          Admin Overview
        </h1>
        <p className="mt-1 text-zinc-400">
          Platform-wide statistics and activity across ZKR Estate.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Users" value={users} icon={Users} />
        <StatsCard label="Total Properties" value={properties} icon={Home} />
        <StatsCard label="Messages" value={messages} icon={MessageSquare} />
        <StatsCard label="Appointments" value={appointments} icon={Calendar} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard label="Agents" value={agents} icon={UserCog} />
        <StatsCard label="Admins" value={admins} icon={ShieldCheck} />
      </div>

      <ChartsGrid
        propertyData={generateChartData(recentProperties)}
        appointmentData={generateChartData(recentAppointments)}
      />

      <ActivityFeed activities={activities} />
    </div>
  );
}
