import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PokemonCardDisplay } from "@/components/pokemon-card-display";
import { useSession } from "@/hooks/auth-hooks";
import { useDebounce } from "@/hooks/use-debounce";
import {
  listPokemonCards,
  deletePokemonCard,
} from "@/lib/db/queries/pokemon-cards";
import { CARD_RARITIES } from "@/lib/db/schemas/pokemon-cards";
import type { PokemonCard, CardRarity } from "@/lib/db/types";

export const Route = createFileRoute("/dashboard/pokemon-cards/")({
  component: PokemonCardsPage,
});

function PokemonCardsPage() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState<CardRarity | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<PokemonCard | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["pokemon-cards", user?.id],
    queryFn: () => listPokemonCards(user!.id),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePokemonCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemon-cards", user?.id] });
      toast.success("Carta removida!");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Erro ao remover carta"),
  });

  const filtered = cards?.filter((card) => {
    const matchesSearch = card.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesRarity =
      rarityFilter === "all" || card.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Minhas Cartas"
        description={`${cards?.length ?? 0} carta${(cards?.length ?? 0) !== 1 ? "s" : ""} na coleção`}
      >
        <Button asChild>
          <Link to="/dashboard/pokemon-cards/new">
            <Plus className="h-4 w-4 mr-1" />
            Nova Carta
          </Link>
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex gap-3 px-6 py-4 border-b bg-background/50">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={rarityFilter}
          onValueChange={(v) => setRarityFilter(v as CardRarity | "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Raridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as raridades</SelectItem>
            {CARD_RARITIES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Card Grid */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
            <span className="text-6xl">🎴</span>
            {search || rarityFilter !== "all" ? (
              <>
                <p className="text-lg font-medium">
                  Nenhuma carta encontrada
                </p>
                <p className="text-sm">
                  Tente ajustar os filtros de busca
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setRarityFilter("all");
                  }}
                >
                  Limpar filtros
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">
                  Sua coleção está vazia
                </p>
                <p className="text-sm">
                  Adicione sua primeira carta Pokémon!
                </p>
                <Button asChild>
                  <Link to="/dashboard/pokemon-cards/new">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar carta
                  </Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((card) => (
              <div key={card.id} className="group relative">
                <PokemonCardDisplay card={card} />
                {/* Action overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 shadow"
                    asChild
                  >
                    <Link
                      to="/dashboard/pokemon-cards/$id"
                      params={{ id: card.id }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 shadow"
                    onClick={() => setDeleteTarget(card)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover carta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover{" "}
              <strong>{deleteTarget?.name}</strong> da sua coleção? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
            >
              {deleteMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
