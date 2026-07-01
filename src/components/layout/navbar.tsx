"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  Heart,
  Search,
  Bell,
  Command
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";
import type { SessionUser } from "@/types";

interface NavbarProps {
  user: SessionUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [searchOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(query ? `/properties?q=${encodeURIComponent(query)}` : "/properties");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/properties?status=FOR_SALE", label: "Buy" },
    { href: "/properties?status=FOR_RENT", label: "Rent" }
  ];

  const accountLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Settings", icon: UserIcon },
    { href: "/dashboard/favorites", label: "Saved", icon: Heart }
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#09090B]/80">
        <div className="container-app flex h-14 items-center justify-between gap-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative h-7 w-7 overflow-hidden rounded-md shadow-sm">
              <Image src="/logo/zkr.jpg" alt="ZKR Estate" fill className="object-cover" sizes="28px" priority />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              ZKR Estate
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 w-64"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex dark:border-white/10 dark:bg-white/5">
                <Command className="h-3 w-3" />
                <span>K</span>
              </kbd>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {user && (
              <button className="relative hidden h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:flex dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
              </button>
            )}

            {user ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-[11px] font-bold text-white ring-2 ring-white transition-all hover:ring-slate-200 dark:ring-[#09090B] dark:hover:ring-white/20"
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#18181B]">
                      <div className="px-2 py-1.5 mb-1 border-b border-slate-100 dark:border-white/5">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
                        <UserIcon className="h-4 w-4" /> Settings
                      </Link>
                      <Link href="/dashboard/favorites" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
                        <Heart className="h-4 w-4" /> Saved
                      </Link>
                      <div className="my-1 border-t border-slate-100 dark:border-white/5" />
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login" className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">Log in</Link>
                <Link href="/register" className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">Sign up</Link>
              </div>
            )}

            <button className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 lg:hidden dark:hover:bg-white/10" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/50 px-4 pt-20 backdrop-blur-sm sm:pt-28" onClick={() => setSearchOpen(false)}>
          <div
            className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#18181B]"
            onClick={(event) => event.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by city, title, or property type..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </form>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs text-slate-400">Press Enter to search all properties</p>
              <button
                onClick={handleSearchSubmit}
                className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white dark:bg-[#09090B] lg:hidden">
          <div className="container-app flex h-14 items-center justify-between">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 overflow-hidden rounded-md"><Image src="/logo/zkr.jpg" alt="ZKR Estate" fill className="object-cover" sizes="28px" /></div>
              <span className="text-base font-bold text-slate-900 dark:text-white">ZKR Estate</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>

          <div className="container-app mt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
              className="flex w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
            >
              <Search className="h-4 w-4" />
              <span>Search properties...</span>
            </button>
          </div>

          <div className="container-app mt-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={cn("block rounded-md px-3 py-2 text-base font-medium", isActive(link.href) ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white" : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5")}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="container-app my-4 border-t border-slate-100 dark:border-white/5" />

          <div className="container-app space-y-1 pb-6">
            {user ? (
              <>
                <div className="mb-2 flex items-center gap-3 rounded-md px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
                  >
                    <link.icon className="h-4 w-4" /> {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-md border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">Log in</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="rounded-md bg-slate-900 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">Sign up</Link>
              </div>
            )}

            <button
              onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
              className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
            >
              {resolvedTheme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {resolvedTheme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}