"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials } from "@/lib/utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  createdAt: string;
  _count: { properties: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.ok ? r.json().catch(() => []) : [])
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{r.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{r.email}</div>
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
          className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
        >
          {r.role}
        </Badge>
      )
    },
    {
      key: "properties",
      header: "Properties",
      render: (r: UserRow) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {r._count.properties}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (r: UserRow) => (
        <span className="text-slate-600 dark:text-slate-400">
          {formatDate(r.createdAt)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {users.length} registered users in the system.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
          <Users className="h-6 w-6" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading users...
          </div>
        ) : (
          <DataTable columns={columns} data={users} keyExtractor={(r) => r.id} />
        )}
      </div>
    </div>
  );
}