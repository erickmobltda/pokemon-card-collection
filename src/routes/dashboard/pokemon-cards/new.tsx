import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PokemonCardDisplay } from "@/components/pokemon-card-display";
import { useSession } from "@/hooks/auth-hooks";
import { createPokemonCard } from "@/lib/db/queries/pokemon-cards";
import {
  createPokemonCardSchema,
  CARD_RARITIES,
  type CreatePokemonCardData,
} from "@/lib/db/schemas/pokemon-cards";
import type { PokemonCard } from "@/lib/db/types";

export const Route = createFileRoute("/dashboard/pokemon-cards/new")({
  component: NewPokemonCardPage,
});

function NewPokemonCardPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<CreatePokemonCardData>({
    resolver: zodResolver(createPokemonCardSchema),
    defaultValues: {
      name: "",
      rarity: "Common",
      hp: 60,
      photo_url: null,
    },
  });

  const values = form.watch();

  const previewCard: PokemonCard = {
    id: "preview",
    user_id: user?.id ?? "",
    name: values.name || "Nome da Carta",
    rarity: values.rarity ?? "Common",
    hp: values.hp ?? 60,
    photo_url: values.photo_url ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const create = useMutation({
    mutationFn: (data: CreatePokemonCardData) =>
      createPokemonCard(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemon-cards", user?.id] });
      toast.success("Carta adicionada à coleção!");
      navigate({ to: "/dashboard/pokemon-cards" });
    },
    onError: () => toast.error("Erro ao adicionar carta"),
  });

  return (
    <div className="flex flex-col">
      <PageHeader title="Nova Carta" description="Adicione uma carta à sua coleção">
        <Button variant="outline" asChild>
          <Link to="/dashboard/pokemon-cards">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
      </PageHeader>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Carta</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => create.mutate(data))}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Pokémon</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Pikachu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raridade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a raridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CARD_RARITIES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
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
                  name="hp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HP</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={9999}
                          placeholder="60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? null : e.target.value,
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        URL pública da imagem da carta (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={create.isPending}
                >
                  {create.isPending
                    ? "Adicionando..."
                    : "Adicionar à coleção"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Pré-visualização
          </p>
          <div className="w-52">
            <PokemonCardDisplay card={previewCard} />
          </div>
        </div>
      </div>
    </div>
  );
}
