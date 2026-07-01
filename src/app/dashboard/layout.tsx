import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import type { SessionUser } from "@/types";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = session.user as SessionUser;

  return (
    <div className="relative min-h-screen bg-[#09090B] text-slate-100 overflow-x-hidden">
      {/* Ambient Background Glows & Noise */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-accent-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay" 
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar user={user} />
          <main className="flex-1 p-4 md:p-8 lg:p-10">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}