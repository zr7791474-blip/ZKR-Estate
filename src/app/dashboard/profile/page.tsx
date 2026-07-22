"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileSchema, ProfileInput } from "@/lib/validations";
import type { SessionUser } from "@/types";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => {
        if (s?.user) {
          setUser(s.user as SessionUser);
          reset({
            name: s.user.name,
            phone: (s.user as any).phone || "",
            avatar: (s.user as any).avatar || ""
          });
        }
      });
  }, [reset]);

  const onSubmit = async (data: ProfileInput) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "Update failed");
      return;
    }
    setSuccess("Profile updated successfully");
    setTimeout(() => setSuccess(null), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl md:p-8">
        <div className="mb-8 flex items-center gap-5 border-b border-white/10 pb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-bold text-white shadow-lg shadow-brand-500/20">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-zinc-400">{user?.email}</p>
            <span className="mt-2 inline-flex items-center rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Full Name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <Input
            label="Avatar URL"
            placeholder="https://example.com/avatar.jpg"
            error={errors.avatar?.message}
            {...register("avatar")}
          />

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-400">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" loading={loading} className="px-6">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}