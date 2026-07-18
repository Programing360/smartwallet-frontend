"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export const getUserToken = async (): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.session?.token ?? null;
};
