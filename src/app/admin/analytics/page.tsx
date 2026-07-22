import prisma from "@/lib/prisma";
import { ChartsGrid } from "@/components/dashboard/charts-grid";
import { BarChart3, TrendingUp, Home, Users } from "lucide-react";

function generateChartData(records: { createdAt: Date }[], days: number = 30) {
  const data = Array(days).fill(0);
  const now = new Date();
  records.forEach((r) => {
    const diff = Math.floor((now.getTime() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < days) data[days - 1 - diff]++;
  });
  return data;
}

export default async function AdminAnalyticsPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    newProperties,
    newUsers,
    propertiesByStatus,
    propertiesByCity,
    totalUsers,
    totalProperties
  ] = await Promise.all([
    prisma.property.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true }
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true }
    }),
    prisma.property.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.property.groupBy({ by: ["city"], _count: { _all: true }, orderBy: { _count: { city: "desc" } }, take: 5 }),
    prisma.user.count(),
    prisma.property.count()
  ]);

  const statusColors: Record<string, string> = {
    FOR_SALE: "bg-emerald-500",
    FOR_RENT: "bg-brand-500",
    SOLD: "bg-zinc-500",
    RENTED: "bg-indigo-500"
  };
  const maxCity = Math.max(...propertiesByCity.map((c) => c._count._all), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Growth and distribution across the platform, last 30 days.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <BarChart3 className="h-6 w-6" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> New signups (30d)
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{newUsers.length}</div>
          <div className="mt-1 text-xs text-zinc-500">of {totalUsers} total users</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Home className="h-4 w-4 text-brand-400" /> New listings (30d)
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{newProperties.length}</div>
          <div className="mt-1 text-xs text-zinc-500">of {totalProperties} total properties</div>
        </div>
      </div>

      <ChartsGrid
        propertyData={generateChartData(newProperties)}
        appointmentData={generateChartData(newUsers)}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-base font-semibold text-white">Properties by status</h3>
          {propertiesByStatus.length === 0 ? (
            <p className="text-sm text-zinc-400">No properties yet.</p>
          ) : (
            <div className="space-y-3">
              {propertiesByStatus.map((s) => {
                const pct = totalProperties > 0 ? Math.round((s._count._all / totalProperties) * 100) : 0;
                return (
                  <div key={s.status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{s.status.replace("_", " ")}</span>
                      <span className="text-zinc-500">{s._count._all} ({pct}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${statusColors[s.status] ?? "bg-zinc-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-accent-400" />
            <h3 className="text-base font-semibold text-white">Top cities by listings</h3>
          </div>
          {propertiesByCity.length === 0 ? (
            <p className="text-sm text-zinc-400">No properties yet.</p>
          ) : (
            <div className="space-y-3">
              {propertiesByCity.map((c) => (
                <div key={c.city}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{c.city}</span>
                    <span className="text-zinc-500">{c._count._all}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-accent-500"
                      style={{ width: `${(c._count._all / maxCity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
