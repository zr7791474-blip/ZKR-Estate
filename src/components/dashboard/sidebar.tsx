"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, Home, Heart, MessageSquare, Calendar, Users,
  LogOut, ChevronDown, Building2, BarChart3, Settings, LifeBuoy, Menu, X
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import type { SessionUser } from "@/types";

interface SidebarProps { user: SessionUser; }

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user.role === "ADMIN";
  const isAgent = user.role === "AGENT" || isAdmin;

  // Close the mobile drawer automatically on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    ...(isAgent ? [{ href: "/dashboard/properties", label: "My Properties", icon: Home }] : []),
    { href: "/dashboard/favorites", label: "Saved", icon: Heart },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/appointments", label: "Appointments", icon: Calendar }
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin Overview", icon: LayoutDashboard },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/agents", label: "Agents", icon: User },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/help", label: "Help & Support", icon: LifeBuoy }
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  const NavContent = () => (
    <>
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Menu
          </h3>
          <div className="space-y-1">
            {links.map((link) => {
              const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "bg-white/5 text-white shadow-sm"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-500 transition-all" />
                  )}
                  <link.icon className={cn("h-4 w-4 transition-colors", active ? "text-brand-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {isAdmin && (
          <div>
            <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Admin
            </h3>
            <div className="space-y-1">
              {adminLinks.map((link) => {
                const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                      active
                        ? "bg-white/5 text-white shadow-sm"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent-500 transition-all" />
                    )}
                    <link.icon className={cn("h-4 w-4 transition-colors", active ? "text-accent-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-1">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-[11px] font-bold text-white">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0A0A0C] bg-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-[13px] font-medium text-white">{user.name}</div>
            <div className="truncate text-[11px] text-zinc-500">{user.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile trigger — floating action button, positioned to never collide with the shared Navbar's logo/icons */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-105 active:scale-95 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-[#0A0A0C]/80 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">ZKR Estate</div>
            <div className="text-[11px] text-zinc-500 truncate">Pro Workspace</div>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </div>
        <NavContent />
      </aside>

      {/* Mobile drawer + backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#0A0A0C] transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">ZKR Estate</div>
              <div className="text-[11px] text-zinc-500 truncate">Pro Workspace</div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <NavContent />
        </aside>
      </div>
    </>
  );
}