import { auth } from "@/app/lib/auth";
import { toNextHandler } from "better-auth/next-js";

export const { GET, POST } = toNextHandler(auth);
