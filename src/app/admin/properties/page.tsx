"use client";

import { useEffect, useState } from "react";
import { Trash2, Building2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  const onDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try {
      await fetch(`/api/properties/${id}`, { method: "DELETE" });
      load();
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

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
            onClick={() => onDelete(r.id)}
            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Properties
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {properties.length} total listings in the database.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
          <Building2 className="h-6 w-6" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading properties...
          </div>
        ) : (
          <DataTable columns={columns} data={properties} keyExtractor={(r) => r.id} />
        )}
      </div>
    </div>
  );
}