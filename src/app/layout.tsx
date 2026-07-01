import type { Metadata } from "next";
import { ThemeProvider, ThemeScript } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZKR Estate — Find Your Dream Home",
  description:
    "Browse properties for sale and rent. Connect with trusted agents and book viewings."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}