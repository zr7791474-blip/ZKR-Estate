import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PropertyGallery } from "@/components/property/property-gallery";
import { AgentCard } from "@/components/property/agent-card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin, Home as HomeIcon } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { auth } from "@/lib/auth";
import type { PropertyWithAgent, SessionUser } from "@/types";

interface PageProps {
  params: { id: string };
}

const statusMap = {
  FOR_SALE: { label: "For Sale", variant: "success" as const },
  FOR_RENT: { label: "For Rent", variant: "info" as const },
  SOLD: { label: "Sold", variant: "default" as const },
  RENTED: { label: "Rented", variant: "default" as const }
};

export default async function PropertyDetailsPage({ params }: PageProps) {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  let property: PropertyWithAgent | null = null;
  try {
    property = (await prisma.property.findUnique({
      where: { id: params.id },
      include: { agent: true }
    })) as unknown as PropertyWithAgent | null;
  } catch (error) {
    console.error("Failed to load property details:", error);
  }

  if (!property) notFound();

  const status = statusMap[property.status];
  let isFavorite = false;
  if (user) {
    try {
      isFavorite = !!(await prisma.favorite.findUnique({
        where: { userId_propertyId: { userId: user.id, propertyId: property.id } }
      }));
    } catch (error) {
      console.error("Failed to check favorite status:", error);
    }
  }

  return (
    <div className="section-padding min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant={status.variant} className="px-3 py-1 text-xs font-semibold">
            {status.label}
          </Badge>
          {property.featured && (
            <Badge variant="warning" className="px-3 py-1 text-xs font-semibold">
              Featured
            </Badge>
          )}
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Listed {formatDate(property.createdAt)}
          </span>
        </div>

        <div className="mb-8">
          <h1 className="mb-3 font-display text-3xl font-medium tracking-tight text-slate-900 md:text-4xl dark:text-white">
            {property.title}
          </h1>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <MapPin className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="text-base">{property.city}</span>
          </div>
        </div>

        <div className="mb-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PropertyGallery images={property.images} />

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Maximize, label: "Area", value: `${property.area} m²` },
                { icon: HomeIcon, label: "Type", value: property.type }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/50"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:group-hover:bg-brand-900/30">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                About this property
              </h2>
              <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
                <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Price
                </div>
                <div className="text-3xl font-bold tracking-tight text-brand-600 dark:text-brand-400">
                  {formatPrice(property.price, property.status)}
                </div>
              </div>

              <AgentCard
                agent={property.agent}
                propertyId={property.id}
                isFavorite={isFavorite}
                user={user ?? null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}