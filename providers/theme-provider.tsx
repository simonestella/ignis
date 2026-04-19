"use client";

import { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ReactNode } from "react";

function getThemeByTime(): "light" | "dark" {
  const h = new Date().getHours();
  return h >= 6 && h < 20 ? "light" : "dark";
}

function TimeBasedTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(getThemeByTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
      <TimeBasedTheme />
      {children}
    </ThemeProvider>
  );
}
