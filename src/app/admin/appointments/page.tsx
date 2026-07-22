"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, User } from "lucide-react";
import { Empty } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { formatDate } from "@/lib/utils";

interface Appointment {
  id: string;
  date: string;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  user: { id: string; name: string; email: string };
  property: { id: string; title: string; city: string; agent: { name: string } };
}

const statusStyle = {
  PENDING: "bg-amber-500/10 text-amber-400",
  CONFIRMED: "bg-emerald-500/10 text-emerald-400",
  CANCELLED: "bg-red-500/10 text-red-400"
} as const;

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = async () => {
    try {
      const res = await fetch("/api/appointments?scope=all");
      const data = res.ok ? await res.json().catch(() => []) : [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) throw new Error("Request failed");
      showToast(
        status === "CONFIRMED" ? "Appointment confirmed." : "Appointment declined.",
        status === "CONFIRMED" ? "success" : "info"
      );
      await load();
    } catch {
      showToast("Couldn't update that appointment. Please try again.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            All viewing requests across the platform.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <Calendar className="h-6 w-6" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <Empty
          icon={<Calendar className="h-6 w-6" />}
          title="No appointments"
          description="Viewing requests booked by users will appear here."
          className="border-white/10 bg-transparent"
          iconClassName="bg-white/5 text-zinc-400"
          titleClassName="text-white"
          descriptionClassName="text-zinc-400"
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.04] hover:border-white/20"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{a.property.title}</h3>
                    <Badge className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${statusStyle[a.status]}`}>
                      {a.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-zinc-500" />
                      {a.property.city}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-zinc-500" />
                      {formatDate(a.date)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Requested by {a.user.name}
                    </span>
                    <span>Agent: {a.property.agent.name}</span>
                  </div>

                  {a.notes && (
                    <div className="rounded-xl bg-white/5 p-3 text-sm text-zinc-300">
                      <span className="font-semibold">Notes:</span> {a.notes}
                    </div>
                  )}
                </div>

                {a.status === "PENDING" && (
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <Button
                      size="sm"
                      loading={updatingId === a.id}
                      onClick={() => updateStatus(a.id, "CONFIRMED")}
                      className="flex-1 sm:flex-none"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === a.id}
                      onClick={() => updateStatus(a.id, "CANCELLED")}
                      className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 sm:flex-none"
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
