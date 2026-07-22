"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatDate, getInitials, cn } from "@/lib/utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  createdAt: string;
  _count: { properties: number };
}

const roleOptions = [
  { value: "ALL", label: "All roles" },
  { value: "USER", label: "User" },
  { value: "AGENT", label: "Agent" },
  { value: "ADMIN", label: "Admin" }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.ok ? r.json().catch(() => []) : [])
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    let rows = users;
    if (roleFilter !== "ALL") {
      rows = rows.filter((u) => u.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [users, search, roleFilter]);

  const columns = [
    {
      key: "name",
      header: "User",
      render: (r: UserRow) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white shadow-sm">
            {getInitials(r.name)}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{r.name}</div>
            <div className="text-xs text-zinc-400">{r.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "role",
      header: "Role",
      render: (r: UserRow) => (
        <Badge
          variant={
            r.role === "ADMIN"
              ? "danger"
              : r.role === "AGENT"
              ? "info"
              : "default"
          }
          className={cn(
            "px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
            r.role === "ADMIN"
              ? "bg-red-500/10 text-red-400"
              : r.role === "AGENT"
              ? "bg-brand-500/10 text-brand-400"
              : "bg-white/10 text-zinc-300"
          )}
        >
          {r.role}
        </Badge>
      )
    },
    {
      key: "properties",
      header: "Properties",
      render: (r: UserRow) => (
        <span className="font-medium text-white">
          {r._count.properties}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (r: UserRow) => (
        <span className="text-zinc-400">
          {formatDate(r.createdAt)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {loading ? "Loading…" : `${visible.length} of ${users.length} registered users`}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <Users className="h-6 w-6" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-brand-500/50 focus:bg-white/[0.04]"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={roleOptions}
          className="border-white/10 bg-white/[0.02] text-white sm:w-44 [&>option]:bg-[#18181B]"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={visible}
            keyExtractor={(r) => r.id}
            emptyMessage={
              users.length === 0
                ? "No registered users yet."
                : "No users match your search or filters."
            }
          />
        )}
      </div>
    </div>
  );
}
