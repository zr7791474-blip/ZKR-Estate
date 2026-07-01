// src/app/(main)/layout.tsx
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { auth } from "@/lib/auth";
import type { SessionUser } from "@/types";

export default async function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ?? null} />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}