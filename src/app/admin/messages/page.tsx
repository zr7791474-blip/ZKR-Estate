"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Empty } from "@/components/ui/empty";
import { getInitials, formatDate } from "@/lib/utils";

interface MessageRow {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; avatar: string | null };
  receiver: { id: string; name: string; avatar: string | null };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages?scope=all")
      .then((r) => (r.ok ? r.json().catch(() => []) : []))
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Messages
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Platform-wide conversations, for oversight only.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <MessageSquare className="h-6 w-6" />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center backdrop-blur-xl">
          <div className="text-sm font-medium text-zinc-400">Loading messages...</div>
        </div>
      ) : messages.length === 0 ? (
        <Empty
          icon={<MessageSquare className="h-6 w-6" />}
          title="No messages yet"
          description="Conversations between users and agents will appear here as they happen."
          className="border-white/10 bg-transparent"
          iconClassName="bg-white/5 text-zinc-400"
          titleClassName="text-white"
          descriptionClassName="text-zinc-400"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="divide-y divide-white/5">
            {messages.map((m) => (
              <div key={m.id} className="flex items-start gap-4 p-4 transition-colors hover:bg-white/[0.03]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                  {getInitials(m.sender.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                    <span className="font-semibold text-white">{m.sender.name}</span>
                    <span className="text-zinc-500">to</span>
                    <span className="font-semibold text-white">{m.receiver.name}</span>
                    <span className="ml-auto shrink-0 text-xs text-zinc-500">{formatDate(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-400">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
