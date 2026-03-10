import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/components/auth-provider";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
          <Toaster richColors position="top-right" />
        </AuthProvider>
        {import.meta.env.DEV && (
          <>
            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools />
          </>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
