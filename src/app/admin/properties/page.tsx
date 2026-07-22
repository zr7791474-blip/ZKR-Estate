"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Building2, Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/providers/toast-provider";
import { formatPrice } from "@/lib/utils";

interface PropertyRow {
  id: string;
  title: string;
  city: string;
  price: number;
  status: string;
  featured: boolean;
  createdAt: string;
  agent: { id: string; name: string; email: string };
}

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "title_asc", label: "Title: A to Z" }
];

const statusOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "FOR_SALE", label: "For sale" },
  { value: "FOR_RENT", label: "For rent" },
  { value: "SOLD", label: "Sold" },
  { value: "RENTED", label: "Rented" }
];

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [pendingDelete, setPendingDelete] = useState<PropertyRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    try {
      const res = await fetch("/api/properties");
      const data = res.ok ? await res.json().catch(() => []) : [];
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Request failed");
      showToast(`"${pendingDelete.title}" was deleted.`, "success");
      setPendingDelete(null);
      load();
    } catch (error) {
      console.error("Failed to delete property:", error);
      showToast("Couldn't delete that property. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const visible = useMemo(() => {
    let rows = properties;

    if (statusFilter !== "ALL") {
      rows = rows.filter((p) => p.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.agent.name.toLowerCase().includes(q)
      );
    }

    const sorted = [...rows];
    switch (sort) {
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "title_asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [properties, search, statusFilter, sort]);

  const columns = [
    { key: "title", header: "Title" },
    { key: "city", header: "City" },
    {
      key: "agent",
      header: "Agent",
      render: (r: PropertyRow) => r.agent.name
    },
    {
      key: "price",
      header: "Price",
      render: (r: PropertyRow) => formatPrice(r.price, r.status)
    },
    {
      key: "status",
      header: "Status",
      render: (r: PropertyRow) => (
        <Badge
          variant={
            r.status === "FOR_SALE"
              ? "success"
              : r.status === "FOR_RENT"
              ? "info"
              : "default"
          }
          className={
            r.status === "FOR_SALE"
              ? "bg-emerald-500/10 text-emerald-400"
              : r.status === "FOR_RENT"
              ? "bg-brand-500/10 text-brand-400"
              : "bg-white/10 text-zinc-300"
          }
        >
          {r.status.replace("_", " ")}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "",
      render: (r: PropertyRow) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPendingDelete(r)}
            className="text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Manage Properties
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {loading ? "Loading…" : `${visible.length} of ${properties.length} listings`}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <Building2 className="h-6 w-6" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, city, or agent..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-brand-500/50 focus:bg-white/[0.04]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:shrink-0">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            className="border-white/10 bg-white/[0.02] text-white sm:w-44 [&>option]:bg-[#18181B]"
          />
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={sortOptions}
            className="border-white/10 bg-white/[0.02] text-white sm:w-48 [&>option]:bg-[#18181B]"
          />
        </div>
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
              properties.length === 0
                ? "No properties have been listed yet."
                : "No properties match your search or filters."
            }
          />
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete property?"
        description={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.title}" from the platform. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
