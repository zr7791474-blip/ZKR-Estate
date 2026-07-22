import { PropertyCard } from "./property-card";
import prisma from "@/lib/prisma";
import type { PropertyWithAgent } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function FeaturedProperties() {
  let properties: PropertyWithAgent[] = [];
  try {
    properties = (await prisma.property.findMany({
      where: { featured: true },
      include: { agent: true },
      orderBy: { createdAt: "desc" },
      take: 6
    })) as unknown as PropertyWithAgent[];
  } catch (err) {
    console.error("Failed to load featured properties:", err);
    return null;
  }

  if (properties.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Featured
            </p>
            <h2 className="font-display text-3xl font-medium text-slate-900 md:text-4xl dark:text-white">
              Hand-picked properties
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Explore our top recommendations from verified agents.
            </p>
          </div>
          <Link
            href="/properties"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 md:flex dark:text-brand-400 dark:hover:text-brand-300"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}