import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Library, Plus, Star } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/auth-hooks";
import { listPokemonCards } from "@/lib/db/queries/pokemon-cards";
import type { CardRarity } from "@/lib/db/types";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexPage,
});

const RARITY_ORDER: CardRarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Holo Rare",
  "Ultra Rare",
  "Secret Rare",
];

function DashboardIndexPage() {
  const { user } = useSession();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["pokemon-cards", user?.id],
    queryFn: () => listPokemonCards(user!.id),
    enabled: !!user?.id,
  });

  const totalCards = cards?.length ?? 0;
  const rarityCounts = RARITY_ORDER.reduce(
    (acc, r) => {
      acc[r] = cards?.filter((c) => c.rarity === r).length ?? 0;
      return acc;
    },
    {} as Record<CardRarity, number>,
  );
  const rarest = cards?.find((c) => c.rarity === "Secret Rare") ??
    cards?.find((c) => c.rarity === "Ultra Rare");

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua coleção"
      >
        <Button asChild>
          <Link to="/dashboard/pokemon-cards/new">
            <Plus className="h-4 w-4 mr-1" />
            Nova Carta
          </Link>
        </Button>
      </PageHeader>

      <div className="p-6 grid gap-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Cartas
              </CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{totalCards}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Ultra/Secret Raras
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">
                  {(rarityCounts["Ultra Rare"] ?? 0) +
                    (rarityCounts["Secret Rare"] ?? 0)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Raridade mais valiosa
              </CardTitle>
              <span className="text-lg">✨</span>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-xl font-bold">
                  {rarest?.rarity ?? "—"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rarity breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Raridade</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : totalCards === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma carta ainda.</p>
                <Button asChild className="mt-4" size="sm">
                  <Link to="/dashboard/pokemon-cards/new">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar primeira carta
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {RARITY_ORDER.map((rarity) => {
                  const count = rarityCounts[rarity] ?? 0;
                  const pct = totalCards > 0 ? (count / totalCards) * 100 : 0;
                  return (
                    <div key={rarity} className="flex items-center gap-3">
                      <span className="w-24 text-sm text-muted-foreground shrink-0">
                        {rarity}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-sm font-medium text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
