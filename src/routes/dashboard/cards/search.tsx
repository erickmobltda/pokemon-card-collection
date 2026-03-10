import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/hooks/auth-hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { createCard } from "@/lib/db/queries/cards";
import {
  addToCollectionSchema,
  CARD_CONDITIONS,
  type AddToCollectionData,
} from "@/lib/db/schemas/cards";

export const Route = createFileRoute("/dashboard/cards/search")({
  component: CardSearchPage,
});

const TCGDEX_BASE = "https://api.tcgdex.net/v2/en";

/** Brief card returned by TCGdex search */
interface TCGdexCardBrief {
  id: string;
  localId: string;
  name: string;
  image?: string;
}

/** Full card returned by TCGdex card detail */
interface TCGdexCardFull {
  id: string;
  localId: string;
  name: string;
  image?: string;
  category?: string;
  hp?: number;
  types?: string[];
  rarity?: string;
  illustrator?: string;
  stage?: string;
  set?: { id: string; name: string };
}

async function fetchCardDetail(id: string): Promise<TCGdexCardFull> {
  const res = await fetch(`${TCGDEX_BASE}/cards/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch card ${id}`);
  return res.json();
}

function CardSearchPage() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TCGdexCardBrief[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [addDialogCard, setAddDialogCard] = useState<TCGdexCardFull | null>(null);
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setIsLoading(true);
    setSearched(true);

    const controller = new AbortController();

    fetch(
      `${TCGDEX_BASE}/cards?name=${encodeURIComponent(debouncedQuery)}&pagination:itemsPerPage=24&sort:field=name`,
      { signal: controller.signal },
    )
      .then((r) => {
        if (!r.ok) throw new Error("Search failed");
        return r.json();
      })
      .then((cards: TCGdexCardBrief[]) => {
        setResults(cards ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          toast.error("Erro ao buscar cartas. Tente novamente.");
        }
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const handleAdd = useCallback(async (card: TCGdexCardBrief) => {
    setLoadingCardId(card.id);
    try {
      const fullCard = await fetchCardDetail(card.id);
      setAddDialogCard(fullCard);
    } catch {
      toast.error("Erro ao carregar detalhes da carta.");
    } finally {
      setLoadingCardId(null);
    }
  }, []);

  const form = useForm<AddToCollectionData>({
    resolver: zodResolver(addToCollectionSchema),
    defaultValues: { condition: "Near Mint", quantity: 1, notes: "" },
  });

  const addMutation = useMutation({
    mutationFn: (data: AddToCollectionData) => {
      if (!addDialogCard) throw new Error("No card selected");
      return createCard(user!.id, {
        external_id: addDialogCard.id,
        name: addDialogCard.name,
        supertype: addDialogCard.category ?? null,
        subtypes: addDialogCard.stage ? [addDialogCard.stage] : null,
        hp: addDialogCard.hp != null ? String(addDialogCard.hp) : null,
        types: addDialogCard.types ?? null,
        rarity: addDialogCard.rarity ?? null,
        set_name: addDialogCard.set?.name ?? null,
        set_id: addDialogCard.set?.id ?? null,
        number: addDialogCard.localId,
        image_url: addDialogCard.image ? `${addDialogCard.image}/high.png` : null,
        artist: addDialogCard.illustrator ?? null,
        condition: data.condition,
        quantity: data.quantity,
        notes: data.notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", user?.id] });
      toast.success(`${addDialogCard?.name} adicionado à coleção!`);
      setAddDialogCard(null);
      form.reset();
    },
    onError: () => toast.error("Erro ao adicionar carta"),
  });

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Buscar Cartas"
        description="Encontre cartas pelo nome e adicione à sua coleção"
      >
        <Button variant="outline" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Minha Coleção
          </Link>
        </Button>
      </PageHeader>

      {/* Search input */}
      <div className="px-6 py-4 border-b">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Digite o nome de um Pokémon (ex: Charizard)..."
            className="pl-10 h-11 text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Busca via TCGdex — resultados em inglês
        </p>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-6">
        {!searched && !isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
            <span className="text-6xl select-none">🔍</span>
            <p className="text-lg font-medium">Busque por uma carta</p>
            <p className="text-sm">Digite o nome de um Pokémon, Treinador ou Energia</p>
            <Button variant="outline" asChild className="mt-2">
              <Link to="/dashboard/cards/new">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar manualmente
              </Link>
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        )}

        {searched && !isLoading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
            <span className="text-6xl select-none">😔</span>
            <p className="text-lg font-medium">Nenhuma carta encontrada</p>
            <p className="text-sm">Tente um nome diferente ou adicione manualmente</p>
            <Button variant="outline" asChild className="mt-2">
              <Link to="/dashboard/cards/new">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar manualmente
              </Link>
            </Button>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((card) => (
              <SearchCardItem
                key={card.id}
                card={card}
                isLoadingDetail={loadingCardId === card.id}
                onAdd={() => {
                  form.reset({ condition: "Near Mint", quantity: 1, notes: "" });
                  handleAdd(card);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add to collection dialog */}
      <Dialog
        open={!!addDialogCard}
        onOpenChange={(open) => {
          if (!open) {
            setAddDialogCard(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar à coleção</DialogTitle>
            <DialogDescription>
              {addDialogCard?.name}
              {addDialogCard?.set?.name && ` — ${addDialogCard.set.name}`}
              {addDialogCard?.localId && ` #${addDialogCard.localId}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 my-2">
            {addDialogCard?.image && (
              <img
                src={`${addDialogCard.image}/low.png`}
                alt={addDialogCard.name}
                className="h-32 rounded-lg object-contain flex-shrink-0"
              />
            )}
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {addDialogCard?.rarity && <span>Raridade: {addDialogCard.rarity}</span>}
              {addDialogCard?.hp != null && <span>HP: {addDialogCard.hp}</span>}
              {addDialogCard?.types && <span>Tipo: {addDialogCard.types.join(", ")}</span>}
              {addDialogCard?.illustrator && <span>Artista: {addDialogCard.illustrator}</span>}
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => addMutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condição</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CARD_CONDITIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={9999} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anotações (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: carta autografada, foil perfeita..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAddDialogCard(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Adicionando..." : "Adicionar à Coleção"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SearchCardItem({
  card,
  isLoadingDetail,
  onAdd,
}: {
  card: TCGdexCardBrief;
  isLoadingDetail: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="group relative rounded-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] hover:-translate-y-0.5">
      <div className="aspect-[3/4] relative">
        {card.image ? (
          <img
            src={`${card.image}/low.png`}
            alt={card.name}
            className="w-full h-full object-contain p-1"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Sem imagem
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="sm"
            onClick={onAdd}
            disabled={isLoadingDetail}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          >
            {isLoadingDetail ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            {isLoadingDetail ? "Carregando..." : "Adicionar"}
          </Button>
        </div>
      </div>
      <div className="p-2">
        <p className="font-semibold text-xs truncate">{card.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">#{card.localId}</p>
      </div>
    </div>
  );
}
