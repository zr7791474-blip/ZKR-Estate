"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginInput } from "@/lib/validations";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      ...data,
      redirect: false
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" loading={loading}>
        Sign in
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-4">
      <div className="mb-6 text-center">
        <Link href="/" className="mb-4 inline-flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-md">
            <Image src="/logo/zkr.jpg" alt="ZKR Estate" fill className="object-cover" sizes="40px" priority />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">ZKR Estate</span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <Suspense fallback={<div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
          Create one
        </Link>
      </p>
    </div>
  );
}