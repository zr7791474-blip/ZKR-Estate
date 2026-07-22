import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { SearchSection } from "@/components/search/search-section";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[url('/images/hero/background.jpg')] bg-cover bg-center scale-105" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.20),transparent_32%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.38),rgba(2,6,23,0.82),rgba(2,6,23,0.96))]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_20%,transparent_80%,rgba(255,255,255,0.03))]" />
      <div className="absolute top-[-8rem] left-[-6rem] h-[28rem] w-[28rem] rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-4rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />

      <div className="container-app relative py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl animate-fade-in-up opacity-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
            Over 10,000+ properties available
          </div>

          <h1
            className="mx-auto mb-6 max-w-4xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-in-up opacity-0"
            style={{ animationDelay: "100ms" }}
          >
            Find a place you'll love to{" "}
            <span className="bg-gradient-to-r from-brand-300 via-orange-200 to-cyan-200 bg-clip-text italic text-transparent">
              call home
            </span>
          </h1>

          <p
            className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg animate-fade-in-up opacity-0"
            style={{ animationDelay: "200ms" }}
          >
            Discover thousands of properties for sale and rent. Connect directly
            with verified agents and book viewings in minutes.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/35"
            >
              Browse properties
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/15 hover:shadow-[0_12px_36px_rgba(0,0,0,0.16)]"
            >
              <Search className="h-4 w-4" />
              List your property
            </Link>
          </div>
        </div>

        <div
          className="mt-14 animate-fade-in-up opacity-0 md:mt-16"
          style={{ animationDelay: "400ms" }}
        >
          <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/10 bg-white/5 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
            <SearchSection variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}