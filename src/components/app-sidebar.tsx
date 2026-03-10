import { LayoutDashboard, Search, Plus, Settings, Shield } from "lucide-react";
import { NavItems } from "@/components/nav-items";
import { NavUser } from "@/components/nav-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { useIsAdmin } from "@/hooks/auth-hooks";

const mainNav = [
  { title: "Minha Coleção", href: "/dashboard", icon: LayoutDashboard },
  { title: "Buscar Cartas", href: "/dashboard/cards/search", icon: Search },
  { title: "Adicionar Manualmente", href: "/dashboard/cards/new", icon: Plus },
  { title: "Configurações", href: "/dashboard/settings", icon: Settings },
];

const adminNav = [
  { title: "Admin", href: "/dashboard/admin", icon: Shield, adminOnly: true },
];

export function AppSidebar() {
  const isAdmin = useIsAdmin();

  return (
    <aside className="flex flex-col w-64 shrink-0 border-r bg-sidebar h-screen">
      <div className="flex items-center gap-2 px-4 py-4 border-b">
        <span className="text-2xl">🎴</span>
        <div>
          <p className="font-bold text-sm leading-tight text-purple-700 dark:text-purple-300">
            PokéCollection
          </p>
          <p className="text-xs text-muted-foreground">Sua coleção de cartas</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-4 space-y-4">
        <NavItems items={mainNav} isAdmin={isAdmin} />
        <Separator />
        <NavItems items={adminNav} isAdmin={isAdmin} />
      </div>

      <div className="border-t p-3 space-y-2">
        <div className="flex justify-end px-1">
          <ThemeToggle />
        </div>
        <NavUser />
      </div>
    </aside>
  );
}
