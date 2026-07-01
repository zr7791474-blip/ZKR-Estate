"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import { Empty } from "@/components/ui/empty";
import type { PropertyWithAgent } from "@/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<PropertyWithAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.ok ? r.json().catch(() => []) : [])
      .then((data) => {
        setFavorites(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Saved Properties
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Properties you've saved for later viewing.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <Heart className="h-6 w-6" />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-12 text-center shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading saved properties...
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-12 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
          <Empty
            icon={<Heart className="h-6 w-6" />}
            title="No saved properties"
            description="Click the heart icon on any property to save it here."
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((p) => (
            <PropertyCard key={p.id} property={p} isFavorite />
          ))}
        </div>
      )}
    </div>
  );
}