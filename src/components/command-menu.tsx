import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Library, Plus, Settings } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const run = (cb: () => void) => {
    setOpen(false);
    cb();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite um comando..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Navegação">
          <CommandItem
            onSelect={() => run(() => navigate({ to: "/dashboard" }))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => navigate({ to: "/dashboard/pokemon-cards" }))
            }
          >
            <Library className="mr-2 h-4 w-4" />
            Minhas Cartas
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ações">
          <CommandItem
            onSelect={() =>
              run(() => navigate({ to: "/dashboard/pokemon-cards/new" }))
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Carta
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => navigate({ to: "/dashboard/settings" }))}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
