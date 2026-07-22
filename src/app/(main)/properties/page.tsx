import prisma from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { Empty } from "@/components/ui/empty";
import { Search as SearchIcon } from "lucide-react";
import type { PropertyWithAgent } from "@/types";
import { SearchSection } from "@/components/search/search-section";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const city = typeof searchParams.city === "string" ? searchParams.city : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  const type = typeof searchParams.type === "string" ? searchParams.type : "";
  const bedrooms = typeof searchParams.bedrooms === "string" ? searchParams.bedrooms : "";
  const bathrooms = typeof searchParams.bathrooms === "string" ? searchParams.bathrooms : "";
  const minPrice = typeof searchParams.minPrice === "string" ? searchParams.minPrice : "";
  const maxPrice = typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : "";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const where: any = {};
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (status) where.status = status;
  if (type) where.type = type;
  if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
  if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms) };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { type: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } }
    ];
  }

  let properties: PropertyWithAgent[] = [];
  let dbError = false;

  try {
    properties = (await prisma.property.findMany({
      where,
      include: { agent: true },
      orderBy: { createdAt: "desc" }
    })) as unknown as PropertyWithAgent[];
  } catch (error) {
    dbError = true;
    console.error("Failed to load properties:", error);
  }

  return (
    <div className="section-padding min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app">
        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-medium tracking-tight text-slate-900 md:text-4xl dark:text-white">
            Discover Properties
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {dbError
              ? "We couldn't load properties right now."
              : q
              ? `${properties.length} ${properties.length === 1 ? "result" : "results"} for "${q}"`
              : `${properties.length} ${properties.length === 1 ? "property" : "properties"} found`}
          </p>
        </div>

        <div className="mb-10">
          <SearchSection variant="page" />
        </div>

        {dbError ? (
          <Empty
            icon={<SearchIcon className="h-6 w-6" />}
            title="Properties temporarily unavailable"
            description="The database connection is not available right now. Please try again in a moment."
          />
        ) : properties.length === 0 ? (
          <Empty
            icon={<SearchIcon className="h-6 w-6" />}
            title="No properties found"
            description="Try adjusting your filters or search criteria."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}