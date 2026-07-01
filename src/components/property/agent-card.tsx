"use client";

import Image from "next/image";
import { useState } from "react";
import { Mail, Phone, MessageSquare, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import type { SessionUser } from "@/types";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
  };
  propertyId: string;
  isFavorite: boolean;
  user: SessionUser | null;
}

export function AgentCard({ agent, propertyId, isFavorite, user }: AgentCardProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [fav, setFav] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleFavorite = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId })
    });
    if (res.ok) {
      const data = await res.json();
      setFav(data.favorited);
    }
    setLoading(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message, receiverId: agent.id })
    });
    if (res.ok) {
      setSuccess("Message sent!");
      setMessage("");
      setTimeout(() => {
        setContactOpen(false);
        setSuccess(null);
      }, 1200);
    }
    setLoading(false);
  };

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, notes, propertyId })
    });
    if (res.ok) {
      setSuccess("Appointment requested!");
      setDate("");
      setNotes("");
      setTimeout(() => {
        setAppointmentOpen(false);
        setSuccess(null);
      }, 1200);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-3">
          {agent.avatar ? (
            <Image
              src={agent.avatar}
              alt={agent.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
              {getInitials(agent.name)}
            </div>
          )}
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Listed by</div>
            <div className="font-semibold text-slate-900 dark:text-white">{agent.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Verified Agent</div>
          </div>
        </div>

        <div className="mb-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            {agent.email}
          </div>
          {agent.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              {agent.phone}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={() => setContactOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
            Contact agent
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setAppointmentOpen(true)}
          >
            <Calendar className="h-4 w-4" />
            Book viewing
          </Button>
          <Button
            variant={fav ? "danger" : "outline"}
            className="w-full"
            onClick={toggleFavorite}
            disabled={loading}
          >
            <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} />
            {fav ? "Saved" : "Save property"}
          </Button>
        </div>
      </div>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Contact agent">
        <form onSubmit={sendMessage} className="space-y-3">
          <Textarea
            label="Your message"
            placeholder="Hi, I'm interested in this property..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {success && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              {success}
            </div>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Send message
          </Button>
        </form>
      </Modal>

      <Modal open={appointmentOpen} onClose={() => setAppointmentOpen(false)} title="Book a viewing">
        <form onSubmit={bookAppointment} className="space-y-3">
          <Input
            label="Preferred date & time"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Textarea
            label="Notes (optional)"
            placeholder="Any specific requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {success && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              {success}
            </div>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Request appointment
          </Button>
        </form>
      </Modal>
    </>
  );
}