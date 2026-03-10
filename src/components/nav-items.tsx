import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

interface NavItemsProps {
  items: NavItem[];
  isAdmin?: boolean;
}

export function NavItems({ items, isAdmin = false }: NavItemsProps) {
  const visible = items.filter((item) => !item.adminOnly || isAdmin);

  return (
    <nav className="space-y-1">
      {visible.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
            "[&.active]:bg-sidebar-accent [&.active]:text-sidebar-foreground",
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
