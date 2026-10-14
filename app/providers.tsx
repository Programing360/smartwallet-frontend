"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-aria-components";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { makeStore } from "@/store";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider navigate={router.push}>
          {children}
        </RouterProvider>
      </ThemeProvider>
    </Provider>
  );
}