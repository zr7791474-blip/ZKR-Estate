"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, User } from "lucide-react";
import { Empty } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Appointment {
  id: string;
  date: string;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  user: { id: string; name: string; email: string };
  property: { id: string; title: string; city: string; agent: { name: string } };
}

const statusVariant = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger"
} as const;

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("USER");

  const load = async () => {
    try {
      const [aptsRes, sessionRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/auth/session")
      ]);
      
      const apts = aptsRes.ok ? await aptsRes.json().catch(() => []) : [];
      const session = sessionRes.ok ? await sessionRes.json().catch(() => null) : null;
      
      setAppointments(Array.isArray(apts) ? apts : []);
      setRole(session?.user?.role || "USER");
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      load();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const isAgent = role === "AGENT" || role === "ADMIN";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {isAgent
              ? "Manage viewing requests for your properties."
              : "Your scheduled property viewings."}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
          <Calendar className="h-6 w-6" />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-12 text-center shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading appointments...
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-12 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
          <Empty
            icon={<Calendar className="h-6 w-6" />}
            title="No appointments"
            description="Book a viewing from any property page to see it here."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/50"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {a.property.title}
                    </h3>
                    <Badge variant={statusVariant[a.status]} className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
                      {a.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {a.property.city}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {formatDate(a.date)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <User className="h-3.5 w-3.5" />
                    {isAgent ? `Requested by: ${a.user.name}` : `Agent: ${a.property.agent.name}`}
                  </div>

                  {a.notes && (
                    <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
                      <span className="font-semibold">Notes:</span> {a.notes}
                    </div>
                  )}
                </div>

                {isAgent && a.status === "PENDING" && (
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <Button
                      size="sm"
                      onClick={() => updateStatus(a.id, "CONFIRMED")}
                      className="flex-1 sm:flex-none"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(a.id, "CANCELLED")}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 sm:flex-none dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}