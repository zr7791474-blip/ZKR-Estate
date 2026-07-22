import prisma from "@/lib/prisma";
import { UserCog, Mail, Phone, Home } from "lucide-react";
import { Empty } from "@/components/ui/empty";
import { getInitials, formatDate } from "@/lib/utils";

export default async function AdminAgentsPage() {
  const agents = await prisma.user.findMany({
    where: { role: "AGENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      createdAt: true,
      _count: { select: { properties: true } }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Agents
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {agents.length} agent{agents.length === 1 ? "" : "s"} listing properties on the platform.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <UserCog className="h-6 w-6" />
        </div>
      </div>

      {agents.length === 0 ? (
        <Empty
          icon={<UserCog className="h-6 w-6" />}
          title="No agents yet"
          description="Agents appear here once a user registers with the agent role, or an admin promotes an existing user."
          className="border-white/10 bg-transparent"
          iconClassName="bg-white/5 text-zinc-400"
          titleClassName="text-white"
          descriptionClassName="text-zinc-400"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-sm">
                  {getInitials(agent.name)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{agent.name}</div>
                  <div className="truncate text-xs text-zinc-400">Joined {formatDate(agent.createdAt)}</div>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-zinc-300">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  <span className="truncate">{agent.email}</span>
                </div>
                {agent.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                    {agent.phone}
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                <Home className="h-4 w-4 text-brand-400" />
                <span className="font-semibold text-white">{agent._count.properties}</span>
                <span className="text-zinc-400">listing{agent._count.properties === 1 ? "" : "s"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
