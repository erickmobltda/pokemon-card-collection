import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, Lock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/hooks/auth-hooks";
import { getProfile, updateProfile } from "@/lib/db/queries/profiles";

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPage,
});

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e _"),
  is_collection_public: z.boolean(),
});

type SettingsData = z.infer<typeof schema>;

function SettingsPage() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
  });

  const form = useForm<SettingsData>({
    resolver: zodResolver(schema),
    values: {
      name: profile?.name ?? "",
      username: profile?.username ?? "",
      is_collection_public: profile?.is_collection_public ?? true,
    },
  });

  const isPublic = form.watch("is_collection_public");
  const username = form.watch("username");

  const update = useMutation({
    mutationFn: (data: SettingsData) => updateProfile(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Configurações salvas!");
    },
    onError: (err: Error) => {
      if (err.message?.includes("unique")) {
        toast.error("Este nome de usuário já está em uso");
      } else {
        toast.error("Erro ao salvar configurações");
      }
    },
  });

  return (
    <div className="flex flex-col">
      <PageHeader title="Configurações" description="Gerencie seu perfil e preferências" />
      <div className="p-6 max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => update.mutate(data))}
                className="space-y-4"
              >
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <Input value={user?.email ?? ""} disabled />
                </FormItem>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de exibição</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-sm text-muted-foreground">
                            /profile/
                          </span>
                          <Input
                            placeholder="seu_username"
                            className="rounded-l-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Seu perfil público ficará em{" "}
                        <strong>/profile/{username || "seu_username"}</strong>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_collection_public"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibilidade da coleção</FormLabel>
                      <div className="flex gap-2 mt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant={field.value ? "default" : "outline"}
                          onClick={() => field.onChange(true)}
                          className="flex-1"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Pública
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={!field.value ? "default" : "outline"}
                          onClick={() => field.onChange(false)}
                          className="flex-1"
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Privada
                        </Button>
                      </div>
                      <FormDescription>
                        {isPublic
                          ? "Qualquer pessoa com o link pode ver sua coleção"
                          : "Só você pode ver sua coleção"}
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={update.isPending}>
                  {update.isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
