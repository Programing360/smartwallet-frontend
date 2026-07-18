"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const serverAction = async (apiUrl: string, data: Record<string, unknown>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const token = session?.session?.token;

  const res = await fetch(`${baseUrl}/${apiUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
