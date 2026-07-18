"use client";

import { authClient } from "./auth-client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function useClientSession() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    session,
    user: session?.user as SessionUser | undefined,
    isPending,
    error,
  };
}
