import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PokemonCardDisplay } from "@/components/pokemon-card-display";
import { useSession } from "@/hooks/auth-hooks";
import {
  getPokemonCard,
  updatePokemonCard,
  deletePokemonCard,
} from "@/lib/db/queries/pokemon-cards";
import {
  updatePokemonCardSchema,
  CARD_RARITIES,
  type UpdatePokemonCardData,
} from "@/lib/db/schemas/pokemon-cards";

export const Route = createFileRoute("/dashboard/pokemon-cards/$id")({
  component: EditPokemonCardPage,
});

function EditPokemonCardPage() {
  const { id } = Route.useParams();
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { data: card, isLoading } = useQuery({
    queryKey: ["pokemon-card", id],
    queryFn: () => getPokemonCard(id),
  });

  const form = useForm<UpdatePokemonCardData>({
    resolver: zodResolver(updatePokemonCardSchema),
    values: card
      ? {
          name: card.name,
          rarity: card.rarity,
          hp: card.hp,
          photo_url: card.photo_url,
        }
      : undefined,
  });

  const values = form.watch();
  const previewCard = card
    ? {
        ...card,
        name: values.name ?? card.name,
        rarity: values.rarity ?? card.rarity,
        hp: values.hp ?? card.hp,
        photo_url: values.photo_url ?? card.photo_url,
      }
    : null;

  const update = useMutation({
    mutationFn: (data: UpdatePokemonCardData) => updatePokemonCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemon-card", id] });
      queryClient.invalidateQueries({ queryKey: ["pokemon-cards", user?.id] });
      toast.success("Carta atualizada!");
      setEditing(false);
    },
    onError: () => toast.error("Erro ao atualizar carta"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePokemonCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemon-cards", user?.id] });
      toast.success("Carta removida!");
      navigate({ to: "/dashboard/pokemon-cards" });
    },
    onError: () => toast.error("Erro ao remover carta"),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="border-b px-6 py-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
          <Skeleton className="h-80 rounded-xl" />
          <div className="flex justify-center">
            <Skeleton className="w-52 aspect-[3/4] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Carta não encontrada</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/pokemon-cards">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader title={card.name} description={`${card.rarity} · HP ${card.hp}`}>
        <Button variant="outline" asChild>
          <Link to="/dashboard/pokemon-cards">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
        )}
        <Button
          variant="destructive"
          size="icon"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </PageHeader>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editing ? "Editar Carta" : "Detalhes da Carta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => update.mutate(data))}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Pokémon</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Pikachu"
                          disabled={!editing}
                          {...field}
                        />
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
                        value={field.value}
                        disabled={!editing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
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
                          disabled={!editing}
                          {...field}
                          value={field.value ?? ""}
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
                          disabled={!editing}
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

                {editing && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        form.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={update.isPending}>
                      {update.isPending ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Visualização
          </p>
          {previewCard && (
            <div className="w-52">
              <PokemonCardDisplay card={previewCard} />
            </div>
          )}
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover carta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{card.name}</strong> da sua
              coleção? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
