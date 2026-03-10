import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile } from "@/lib/db/queries/profiles";

export const Route = createFileRoute("/dashboard/admin/users/$userId")({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = Route.useParams();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="border-b px-6 py-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="p-6">
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader title={profile?.name ?? "Usuário"} description={profile?.email} />
      <div className="p-6 max-w-lg">
        <Card>
          <CardContent className="pt-6 space-y-2">
            <p><span className="font-medium">E-mail:</span> {profile?.email}</p>
            <p><span className="font-medium">Papel:</span> {profile?.role}</p>
            <p><span className="font-medium">Banido:</span> {profile?.banned ? "Sim" : "Não"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
