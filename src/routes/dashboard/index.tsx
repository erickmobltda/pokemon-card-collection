import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Trash2, Eye } from "lucide-react";
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
import { CardThumbnail } from "@/components/card-thumbnail";
import { useSession } from "@/hooks/auth-hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { listCards, deleteCard } from "@/lib/db/queries/cards";
import { CARD_CONDITIONS, CARD_SUPERTYPES, POKEMON_TYPES } from "@/lib/db/schemas/cards";
import type { Card } from "@/lib/db/types";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [supertype, setSupertype] = useState("all");
  const [type, setType] = useState("all");
  const [rarity, setRarity] = useState("all");
  const [condition, setCondition] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["cards", user?.id, { supertype, type, rarity, condition }],
    queryFn: () =>
      listCards(user!.id, {
        supertype,
        types: type,
        rarity,
        condition,
      }),
    enabled: !!user?.id,
  });

  const filtered = cards?.filter((card) =>
    card.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", user?.id] });
      toast.success("Carta removida da coleção!");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Erro ao remover carta"),
  });

  const hasFilters =
    search ||
    supertype !== "all" ||
    type !== "all" ||
    rarity !== "all" ||
    condition !== "all";

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Minha Coleção"
        description={`${cards?.length ?? 0} carta${(cards?.length ?? 0) !== 1 ? "s" : ""} na coleção`}
      >
        <Button asChild>
          <Link to="/dashboard/cards/search">
            <Search className="h-4 w-4 mr-1" />
            Buscar &amp; Adicionar Cartas
          </Link>
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 px-6 py-3 border-b bg-muted/30">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={supertype} onValueChange={setSupertype}>
          <SelectTrigger className="w-36 h-9">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1 shrink-0" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {CARD_SUPERTYPES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Elemento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os elementos</SelectItem>
            {POKEMON_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={rarity} onValueChange={setRarity}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Raridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas raridades</SelectItem>
            {[
              "Common",
              "Uncommon",
              "Rare",
              "Rare Holo",
              "Ultra Rare",
              "Secret Rare",
              "Promo",
            ].map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Condição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas condições</SelectItem>
            {CARD_CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground"
            onClick={() => {
              setSearch("");
              setSupertype("all");
              setType("all");
              setRarity("all");
              setCondition("all");
            }}
          >
            Limpar filtros
          </Button>
        )}
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
            <span className="text-7xl select-none">🎴</span>
            {hasFilters ? (
              <>
                <p className="text-lg font-medium">Nenhuma carta encontrada</p>
                <p className="text-sm">Tente ajustar os filtros</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setSupertype("all");
                    setType("all");
                    setRarity("all");
                    setCondition("all");
                  }}
                >
                  Limpar filtros
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Sua coleção está vazia</p>
                <p className="text-sm">Comece buscando por cartas Pokémon!</p>
                <Button asChild>
                  <Link to="/dashboard/cards/search">
                    <Search className="h-4 w-4 mr-1" />
                    Buscar cartas para adicionar
                  </Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((card) => (
              <div key={card.id} className="group relative">
                <CardThumbnail card={card} />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-7 w-7 shadow" asChild>
                    <Link to="/dashboard/cards/$id" params={{ id: card.id }}>
                      <Eye className="h-3.5 w-3.5" />
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

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover carta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{deleteTarget?.name}</strong> da sua coleção?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
