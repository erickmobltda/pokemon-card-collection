import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/db/client";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { RealtimeProvider } from "@/components/realtime-provider";

export const Route = createFileRoute("/dashboard/_layout")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { user: session.user };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <RealtimeProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <CommandMenu />
      </div>
    </RealtimeProvider>
  );
}
