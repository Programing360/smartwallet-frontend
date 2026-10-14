"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/layout/Navbar"), {
  ssr: false,
  loading: () => (
    <nav className="flex h-16 items-center border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </nav>
  ),
});

import Footer from "@/components/layout/Footer";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
