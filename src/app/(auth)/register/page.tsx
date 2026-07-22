"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { registerSchema, RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" }
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Registration failed");
        setLoading(false);
        return;
      }
      const signInRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });
      setLoading(false);
      if (signInRes?.error) {
        setError("Account created but sign-in failed. Please log in.");
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="mb-6 text-center">
        <Link href="/" className="mb-4 inline-flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-md">
            <Image src="/logo/zkr.jpg" alt="ZKR Estate" fill className="object-cover" sizes="40px" priority />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">ZKR Estate</span>
        </Link>
        <h1 className="mt-4 font-display text-3xl font-medium text-slate-900 dark:text-white">Create account</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Join ZKR Estate and start exploring
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-slate-700/70 dark:bg-slate-800/60">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <Select
            label="I want to"
            options={[
              { value: "USER", label: "Browse & save properties" },
              { value: "AGENT", label: "List & manage properties" }
            ]}
            {...register("role")}
          />
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}