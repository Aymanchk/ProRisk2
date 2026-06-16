"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme/theme";
import { StoreProvider } from "./StoreProvider";

/**
 * Client-side provider stack:
 * - AppRouterCacheProvider: emotion cache wired for the App Router (SSR-safe styles)
 * - ThemeProvider + CssBaseline: brand MUI theme
 * - StoreProvider: shared MobX root store
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoreProvider>{children}</StoreProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
