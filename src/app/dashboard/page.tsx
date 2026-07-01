import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { SessionUser } from "@/types";
import { HeroSection } from "@/components/dashboard/hero-section";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ChartsGrid } from "@/components/dashboard/charts-grid";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AccountCard } from "@/components/dashboard/account-card";

export default async function DashboardOverviewPage() {
  const session = await auth();
  const user = session?.user as SessionUser;
  const isAgent = user.role === "AGENT" || user.role === "ADMIN";

  const [propertiesCount, favoritesCount, messagesCount, appointmentsCount] = await Promise.all([
    isAgent ? prisma.property.count({ where: { agentId: user.id } }) : Promise.resolve(0),
    prisma.favorite.count({ where: { userId: user.id } }),
    prisma.message.count({ where: { OR: [{ senderId: user.id }, { receiverId: user.id }] } }),
    isAgent ? prisma.appointment.count({ where: { property: { agentId: user.id } } }) : prisma.appointment.count({ where: { userId: user.id } })
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [recentProperties, recentAppointments, recentMessages, recentFavorites] = await Promise.all([
    prisma.property.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, ...(isAgent ? { agentId: user.id } : {}) },
      select: { id: true, title: true, createdAt: true, status: true },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.appointment.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, ...(isAgent ? { property: { agentId: user.id } } : { userId: user.id }) },
      select: { id: true, date: true, status: true, createdAt: true, property: { select: { title: true } }, user: { select: { name: true } } },
      orderBy: { date: "desc" },
      take: 50
    }),
    prisma.message.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, OR: [{ senderId: user.id }, { receiverId: user.id }] },
      select: { id: true, content: true, createdAt: true, sender: { select: { name: true } }, receiver: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.favorite.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, userId: user.id },
      select: { id: true, createdAt: true, property: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ]);

  const generateChartData = (records: { createdAt: Date }[], days: number = 30) => {
    const data = Array(days).fill(0);
    const now = new Date();
    records.forEach(r => {
      const diff = Math.floor((now.getTime() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < days) data[days - 1 - diff]++;
    });
    return data;
  };

  const stats = [
    { label: "Total Properties", value: propertiesCount, icon: "Home" as const, trend: "+12%", color: "#6366f1", iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400", chartData: generateChartData(recentProperties) },
    { label: "Saved Properties", value: favoritesCount, icon: "Heart" as const, trend: "+5%", color: "#ec4899", iconBg: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400", chartData: generateChartData(recentFavorites) },
    { label: "Messages", value: messagesCount, icon: "MessageSquare" as const, trend: "+24%", color: "#10b981", iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", chartData: generateChartData(recentMessages) },
    { label: "Appointments", value: appointmentsCount, icon: "Calendar" as const, trend: "+8%", color: "#f59e0b", iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", chartData: generateChartData(recentAppointments) }
  ];

  const activities = [
    ...recentProperties.map(p => ({ id: p.id, type: 'property' as const, title: 'Property Created', description: p.title, timestamp: p.createdAt })),
    ...recentAppointments.map(a => ({ id: a.id, type: 'appointment' as const, title: 'Appointment Booked', description: a.property.title, timestamp: a.createdAt })),
    ...recentMessages.map(m => ({ id: m.id, type: 'message' as const, title: 'New Message', description: m.content.slice(0, 30) + '...', timestamp: m.createdAt })),
    ...recentFavorites.map(f => ({ id: f.id, type: 'favorite' as const, title: 'Property Saved', description: f.property.title, timestamp: f.createdAt }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);

  return (
    <div className="space-y-6">
      <HeroSection user={user} appointmentsCount={appointmentsCount} messagesCount={messagesCount} />
      <StatsGrid stats={stats} />
      <ChartsGrid propertyData={generateChartData(recentProperties)} appointmentData={generateChartData(recentAppointments)} />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        <div className="space-y-6">
          <QuickActions isAgent={isAgent} />
          <AccountCard user={user} />
        </div>
      </div>
    </div>
  );
}