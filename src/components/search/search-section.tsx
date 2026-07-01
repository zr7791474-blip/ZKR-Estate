"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";

interface SearchSectionProps {
  variant?: "hero" | "page";
}

const statusOptions = [
  { value: "FOR_SALE", label: "Buy" },
  { value: "FOR_RENT", label: "Rent" }
];

const bedroomOptions = Array.from({ length: 6 }, (_, i) => ({
  value: String(i),
  label: i === 5 ? "5+" : String(i)
}));

const bathroomOptions = Array.from({ length: 5 }, (_, i) => ({
  value: String(i),
  label: i === 4 ? "4+" : String(i)
}));

export function SearchSection({ variant = "page" }: SearchSectionProps) {
  const router = useRouter();
  const filters = useFilterStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.city) params.set("city", filters.city);
    if (filters.status) params.set("status", filters.status);
    if (filters.type) params.set("type", filters.type);
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    if (filters.bathrooms) params.set("bathrooms", filters.bathrooms);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "rounded-[1.5rem] border border-white/10 bg-white/8 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-300 md:p-6 dark:border-slate-700/60 dark:bg-slate-900/35 dark:shadow-[0_20px_50px_rgba(0,0,0,0.28)]",
        "supports-[backdrop-filter]:bg-white/8 supports-[backdrop-filter]:dark:bg-slate-900/35",
        variant === "hero" && "mx-auto max-w-5xl"
      )}
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Input
            placeholder="City (e.g. New York)"
            value={filters.city}
            onChange={(e) => filters.setFilter("city", e.target.value)}
          />
        </div>
        <Select
          placeholder="Buy / Rent"
          options={statusOptions}
          value={filters.status}
          onChange={(e) => filters.setFilter("status", e.target.value)}
        />
        <Select
          placeholder="Bedrooms"
          options={bedroomOptions}
          value={filters.bedrooms}
          onChange={(e) => filters.setFilter("bedrooms", e.target.value)}
        />
        <Select
          placeholder="Bathrooms"
          options={bathroomOptions}
          value={filters.bathrooms}
          onChange={(e) => filters.setFilter("bathrooms", e.target.value)}
        />
        <Button
          type="submit"
          size="lg"
          className="h-full bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}