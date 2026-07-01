"use client";

import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { PropertyWithAgent } from "@/types";

interface PropertyCardProps {
  property: PropertyWithAgent;
  isFavorite?: boolean;
}

const statusMap: Record<
  string,
  { label: string; variant: "success" | "info" | "default" | "warning" }
> = {
  FOR_SALE: { label: "For Sale", variant: "success" },
  FOR_RENT: { label: "For Rent", variant: "info" },
  SOLD: { label: "Sold", variant: "default" },
  RENTED: { label: "Rented", variant: "default" }
};

export function PropertyCard({ property, isFavorite }: PropertyCardProps) {
  const status = statusMap[property.status] || statusMap.FOR_SALE;

  const image =
    property.images[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_10px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.36)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
          sizes="(max-width:768px) 100vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex gap-2">
          <div className="rounded-full border border-white/14 bg-white/12 px-0.5 py-0.5 shadow-[0_10px_20px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          {property.featured && (
            <div className="rounded-full border border-white/14 bg-white/12 px-0.5 py-0.5 shadow-[0_10px_20px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <Badge variant="warning">Featured</Badge>
            </div>
          )}
        </div>

        {typeof isFavorite === "boolean" && (
          <div className="absolute right-3 top-3">
            <button
              type="button"
              className={
                "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/80 shadow-[0_10px_24px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-300 group-hover:scale-105 " +
                (isFavorite
                  ? "text-red-500"
                  : "text-slate-400 dark:text-slate-200")
              }
            >
              <Heart
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-5 dark:bg-slate-900">
        <div className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          {property.city}
        </div>

        <h3 className="mb-2 line-clamp-1 text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white">
          {property.title}
        </h3>

        <p className="mb-4 text-xl font-bold leading-none text-brand-600 dark:text-brand-400">
          {formatPrice(property.price, property.status)}
        </p>

        <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Bed className="h-3.5 w-3.5" />
            {property.bedrooms} beds
          </span>

          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms} baths
          </span>

          <span className="flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5" />
            {property.area} m²
          </span>
        </div>
      </div>
    </Link>
  );
}