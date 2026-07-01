import { Hero } from "@/components/home/hero";
import { FeaturedProperties } from "@/components/property/featured-properties";
import { Shield, Users, Home as HomeIcon, TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { StatCard } from "@/components/home/stat-card";

const stats = [
  { icon: HomeIcon, value: 10, suffix: "K+", label: "Properties" },
  { icon: Users, value: 8, suffix: "K+", label: "Happy clients" },
  { icon: Shield, value: 500, suffix: "+", label: "Verified agents" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Success rate" }
];

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <Hero />

      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="container-app">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                icon={<stat.icon className="h-6 w-6" />}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      <FeaturedProperties />

      {user && (
        <section
          className="section-padding bg-slate-50 dark:bg-slate-800 animate-fade-in-up opacity-0"
          style={{ animationDelay: "200ms" }}
        >
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                Ready to find your next home?
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Explore thousands of properties and connect with verified agents.
              </p>
              <a
                href="/properties"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:scale-105 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/40 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                Browse properties
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}