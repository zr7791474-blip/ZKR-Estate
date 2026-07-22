"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SiteSettings {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setSettings({ siteName: data.siteName, supportEmail: data.supportEmail, maintenanceMode: data.maintenanceMode });
      })
      .catch(() => setError("Could not load settings."))
      .finally(() => setLoading(false));
  }, []);

  const onSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save settings");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Platform-wide configuration for ZKR Estate.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <SettingsIcon className="h-6 w-6" />
        </div>
      </div>

      <div className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
        {loading || !settings ? (
          <div className="py-8 text-center text-sm text-zinc-400">Loading settings...</div>
        ) : (
          <div className="space-y-5">
            <Input
              label="Site name"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
            <Input
              label="Support email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <div>
                <div className="text-sm font-medium text-white">Maintenance mode</div>
                <div className="text-xs text-zinc-400">Show a maintenance notice to visitors (does not affect admin access).</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.maintenanceMode}
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings.maintenanceMode ? "bg-brand-500" : "bg-white/10"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
            )}

            <Button onClick={onSave} loading={saving} className="w-full sm:w-auto">
              {saved ? (
                <>
                  <Check className="h-4 w-4" /> Saved
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
