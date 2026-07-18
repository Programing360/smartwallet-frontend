"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-aria-components";
import { useRouter } from "next/navigation";
import { makeStore, type AppStore } from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </Provider>
  );
}
