"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientSession } from "@/app/lib/session";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPending, error } = useClientSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [isPending, user, router, error]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
