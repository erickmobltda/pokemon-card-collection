import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardThumbnail } from "@/components/card-thumbnail";
import { getProfileByUsername } from "@/lib/db/queries/profiles";
import { listPublicCards } from "@/lib/db/queries/cards";

export const Route = createFileRoute("/profile/$username")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { username } = Route.useParams();

  const { data: profile, isLoading: profileLoading, isError } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: () => getProfileByUsername(username),
    retry: false,
  });

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["public-cards", profile?.id],
    queryFn: () => listPublicCards(profile!.id),
    enabled: !!profile?.id && profile.is_collection_public,
  });

  const isLoading = profileLoading || (!!profile && cardsLoading);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="text-7xl block">😔</span>
          <h1 className="text-2xl font-bold">Perfil não encontrado</h1>
          <p className="text-muted-foreground">
            O usuário <strong>@{username}</strong> não existe ou não está disponível.
          </p>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Página inicial
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const initials = (profile.name ?? profile.username ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950">
      {/* Header bar */}
      <header className="border-b bg-white/70 dark:bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎴</span>
            <span className="font-bold text-purple-700 dark:text-purple-300">PokéCollection</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Profile header */}
        <div className="bg-white/70 dark:bg-black/30 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-6 shadow-sm">
          <Avatar className="h-20 w-20 border-4 border-purple-200 dark:border-purple-700">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="text-2xl font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.name ?? profile.username}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
            {profile.is_collection_public && cards && (
              <p className="text-sm mt-1 text-purple-600 dark:text-purple-400 font-medium">
                {cards.length} carta{cards.length !== 1 ? "s" : ""} na coleção
              </p>
            )}
          </div>
        </div>

        {/* Collection */}
        {!profile.is_collection_public ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <Lock className="h-12 w-12 text-purple-400" />
            <p className="text-xl font-semibold">Coleção privada</p>
            <p className="text-sm">
              {profile.name ?? profile.username} optou por manter a coleção privada.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : !cards || cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <span className="text-7xl select-none">🎴</span>
            <p className="text-xl font-semibold">Coleção vazia</p>
            <p className="text-sm">
              {profile.name ?? profile.username} ainda não adicionou cartas.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200">
              Coleção de {profile.name ?? profile.username}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {cards.map((card) => (
                <CardThumbnail key={card.id} card={card} readOnly />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
