"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Empty } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import type { SessionUser } from "@/types";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; avatar: string | null };
  receiver: { id: string; name: string; avatar: string | null };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [me, setMe] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/messages").then((r) => r.ok ? r.json().catch(() => []) : []),
      fetch("/api/auth/session").then((r) => r.ok ? r.json().catch(() => null) : null)
    ]).then(([msgs, session]) => {
      setMessages(Array.isArray(msgs) ? msgs : []);
      setMe(session?.user as SessionUser);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const conversations = messages.reduce<
    Record<string, { partner: { id: string; name: string; avatar: string | null }; last: Message; count: number }>
  >((acc, m) => {
    if (!me) return acc;
    const partnerId = m.sender.id === me.id ? m.receiver.id : m.sender.id;
    const partner = m.sender.id === me.id ? m.receiver : m.sender;
    if (!acc[partnerId]) {
      acc[partnerId] = { partner, last: m, count: 0 };
    }
    acc[partnerId].count++;
    if (new Date(m.createdAt) > new Date(acc[partnerId].last.createdAt)) {
      acc[partnerId].last = m;
    }
    return acc;
  }, {});

  const thread = selected
    ? messages.filter(
        (m) =>
          (m.sender.id === selected && m.receiver.id === me?.id) ||
          (m.receiver.id === selected && m.sender.id === me?.id)
      )
    : [];

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !selected || !me) return;
    setSending(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft, receiverId: selected })
      });
      setDraft("");
      const updatedRes = await fetch("/api/messages");
      const updated = updatedRes.ok ? await updatedRes.json().catch(() => []) : [];
      setMessages(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const convList = Object.values(conversations);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-medium text-white">Messages</h1>
        <p className="mt-1 text-zinc-400">
          Conversations with agents and users.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">Loading...</div>
      ) : convList.length === 0 ? (
        <Empty
          icon={<MessageSquare className="h-6 w-6" />}
          title="No messages yet"
          description="Contact an agent from any property page to start a conversation."
          className="border-white/10 bg-transparent"
          iconClassName="bg-white/5 text-zinc-400"
          titleClassName="text-white"
          descriptionClassName="text-zinc-400"
        />
      ) : (
        <div className="grid h-[600px] gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl lg:grid-cols-3">
          <div className="overflow-y-auto border-r border-white/10">
            {convList.map((c) => (
              <button
                key={c.partner.id}
                onClick={() => setSelected(c.partner.id)}
                className={
                  "flex w-full items-center gap-3 border-b border-white/5 p-4 text-left transition " +
                  (selected === c.partner.id ? "bg-brand-500/10" : "hover:bg-white/5")
                }
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-400">
                  {getInitials(c.partner.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">
                    {c.partner.name}
                  </div>
                  <div className="truncate text-xs text-zinc-400">
                    {c.last.content}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:col-span-2">
            {selected ? (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {thread.map((m) => {
                    const mine = m.sender.id === me?.id;
                    return (
                      <div
                        key={m.id}
                        className={"flex " + (mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={
                            "max-w-[75%] rounded-2xl px-4 py-2 text-sm " +
                            (mine
                              ? "bg-brand-600 text-white"
                              : "bg-white/10 text-white")
                          }
                        >
                          <div>{m.content}</div>
                          <div
                            className={
                              "mt-1 text-[10px] " +
                              (mine ? "text-brand-100" : "text-zinc-400")
                            }
                          >
                            {formatDate(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form
                  onSubmit={send}
                  className="flex items-center gap-2 border-t border-white/10 p-3"
                >
                  <Input
                    placeholder="Type a message..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" loading={sending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}