import { createFileRoute, Link } from "@tanstack/react-router";
import { Library, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎴</span>
          <span className="font-bold text-xl text-purple-700 dark:text-purple-300">
            PokéCollection
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-1" />
              Entrar
            </Link>
          </Button>
          <Button asChild>
            <Link to="/register">
              <UserPlus className="h-4 w-4 mr-1" />
              Cadastrar
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="text-7xl mb-4">🎴</div>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Sua coleção de{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Pokémon Cards
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Organize, gerencie e exiba suas cartas Pokémon favoritas em um só
            lugar.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild className="shadow-lg">
            <Link to="/register">
              <Library className="h-5 w-5 mr-2" />
              Começar agora — é grátis
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Já tenho conta</Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8 max-w-lg text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">📋</span>
            <span>Cadastre suas cartas</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span>Filtre por raridade</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>Visual de TCG real</span>
          </div>
        </div>
      </main>
    </div>
  );
}
