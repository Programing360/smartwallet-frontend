"use client";

import { authClient } from "./auth-client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  role?: string; // present if you're using better-auth's admin/role plugin
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ClientSessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  role?: string; // present if you're using better-auth's admin/role plugin
  createdAt?: Date;
  updatedAt?: Date;
}
export function useClientSession() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    session,
    user: session?.user as ClientSessionUser | undefined,
    isPending,
    error,
  };
}
