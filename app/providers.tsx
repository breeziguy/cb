'use client';
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";
import { NotificationProvider } from "@/contexts/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance with optimized settings for navigation
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Don't refetch on mount if data exists
        refetchOnReconnect: 'always',
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default Providers;
