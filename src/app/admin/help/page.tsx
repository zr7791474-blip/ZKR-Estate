import prisma from "@/lib/prisma";
import { LifeBuoy, Mail, BookOpen, ShieldQuestion } from "lucide-react";

const faqs = [
  {
    q: "How do I promote a user to Agent or Admin?",
    a: "Open Users, find the account, and adjust their role. Role changes take effect the next time they sign in."
  },
  {
    q: "A property listing looks incorrect or inappropriate — what do I do?",
    a: "Go to Properties, locate the listing, and remove it. The listing's agent will need to re-create it if it was removed in error."
  },
  {
    q: "How do I see what's happening on the platform right now?",
    a: "The Admin Overview page shows live totals and a 30-day activity feed. Analytics breaks growth down by status and city."
  },
  {
    q: "Where do appointment cancellations get handled?",
    a: "Under Appointments, any pending request can be confirmed or declined directly."
  }
];

export default async function AdminHelpPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Help &amp; Support
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Answers for common admin tasks, and how to escalate.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <LifeBuoy className="h-6 w-6" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldQuestion className="h-4 w-4 text-brand-400" /> Frequently asked
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-white">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-brand-400" /> Need more help?
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Reach the engineering/support contact configured for this platform.
            </p>
            <a
              href={`mailto:${settings.supportEmail}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              {settings.supportEmail}
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BookOpen className="h-4 w-4 text-accent-400" /> Where things live
            </div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              <li>Listings &amp; moderation → <span className="text-zinc-300">Properties</span></li>
              <li>Accounts &amp; roles → <span className="text-zinc-300">Users</span></li>
              <li>Agent performance → <span className="text-zinc-300">Agents</span></li>
              <li>Platform config → <span className="text-zinc-300">Settings</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
