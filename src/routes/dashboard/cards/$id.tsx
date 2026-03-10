import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/auth-hooks";
import { getCard, updateCard, deleteCard } from "@/lib/db/queries/cards";
import {
  updateCardSchema,
  CARD_CONDITIONS,
  type UpdateCardData,
} from "@/lib/db/schemas/cards";
import { conditionBadgeClass } from "@/components/card-thumbnail";

export const Route = createFileRoute("/dashboard/cards/$id")({
  component: CardDetailPage,
});

function CardDetailPage() {
  const { id } = Route.useParams();
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: card, isLoading } = useQuery({
    queryKey: ["card", id],
    queryFn: () => getCard(id),
  });

  const form = useForm<UpdateCardData>({
    resolver: zodResolver(updateCardSchema),
    values: card
      ? {
          condition: card.condition,
          quantity: card.quantity,
          notes: card.notes,
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCardData) => updateCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", id] });
      queryClient.invalidateQueries({ queryKey: ["cards", user?.id] });
      toast.success("Carta atualizada!");
      setIsEditing(false);
    },
    onError: () => toast.error("Erro ao atualizar carta"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", user?.id] });
      toast.success("Carta removida da coleção!");
      navigate({ to: "/dashboard" });
    },
    onError: () => toast.error("Erro ao remover carta"),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-[3/4] rounded-2xl" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
        <span className="text-5xl">😔</span>
        <p className="text-lg font-medium">Carta não encontrada</p>
        <Button asChild variant="outline">
          <Link to="/dashboard">Voltar à coleção</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader title={card.name} description={card.set_name ?? "Carta manual"}>
        <div className="flex gap-2">
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
        {/* Card image */}
        <div className="flex justify-center">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={card.name}
              className="rounded-2xl shadow-2xl max-h-[500px] object-contain"
            />
          ) : (
            <div className="aspect-[3/4] w-full max-w-xs rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700 flex items-center justify-center bg-purple-50 dark:bg-purple-950/30">
              <div className="text-center text-muted-foreground">
                <span className="text-6xl block mb-2">🎴</span>
                <p className="text-sm">Sem imagem</p>
              </div>
            </div>
          )}
        </div>

        {/* Details / Edit form */}
        <div className="space-y-4">
          {/* Static info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {card.supertype && (
              <>
                <span className="text-muted-foreground font-medium">Tipo</span>
                <span>{card.supertype}</span>
              </>
            )}
            {card.hp && (
              <>
                <span className="text-muted-foreground font-medium">HP</span>
                <span>{card.hp}</span>
              </>
            )}
            {card.types && card.types.length > 0 && (
              <>
                <span className="text-muted-foreground font-medium">Elemento</span>
                <div className="flex gap-1 flex-wrap">
                  {card.types.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </>
            )}
            {card.subtypes && card.subtypes.length > 0 && (
              <>
                <span className="text-muted-foreground font-medium">Subtipo</span>
                <span>{card.subtypes.join(", ")}</span>
              </>
            )}
            {card.rarity && (
              <>
                <span className="text-muted-foreground font-medium">Raridade</span>
                <span>{card.rarity}</span>
              </>
            )}
            {card.set_name && (
              <>
                <span className="text-muted-foreground font-medium">Set</span>
                <span>{card.set_name}</span>
              </>
            )}
            {card.number && (
              <>
                <span className="text-muted-foreground font-medium">Número</span>
                <span>{card.number}</span>
              </>
            )}
            {card.artist && (
              <>
                <span className="text-muted-foreground font-medium">Artista</span>
                <span>{card.artist}</span>
              </>
            )}
          </div>

          <div className="border-t pt-4">
            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))}
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
                          <Input type="number" min={1} max={9999} {...field} value={field.value ?? 1} />
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
                        <FormLabel>Anotações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações pessoais..."
                            className="resize-none"
                            rows={3}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                      <Check className="h-4 w-4 mr-1" />
                      {updateMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <span className="text-muted-foreground font-medium">Condição</span>
                <span>
                  <Badge className={conditionBadgeClass(card.condition)}>
                    {card.condition}
                  </Badge>
                </span>
                <span className="text-muted-foreground font-medium">Quantidade</span>
                <span className="font-semibold">{card.quantity}x</span>
                {card.notes && (
                  <>
                    <span className="text-muted-foreground font-medium">Anotações</span>
                    <span className="col-span-1 whitespace-pre-wrap">{card.notes}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground border-t pt-3">
            Adicionado em {new Date(card.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover carta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{card.name}</strong> da sua coleção? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
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
