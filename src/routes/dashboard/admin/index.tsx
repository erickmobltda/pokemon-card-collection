import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listProfiles } from "@/lib/db/queries/profiles";

export const Route = createFileRoute("/dashboard/admin/")({
  component: AdminIndexPage,
});

function AdminIndexPage() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: listProfiles,
  });

  return (
    <div className="flex flex-col">
      <PageHeader title="Painel Admin" description="Gerenciar usuários e configurações" />
      <div className="p-6 grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{profiles?.length ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
