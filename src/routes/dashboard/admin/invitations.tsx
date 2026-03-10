import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/dashboard/admin/invitations")({
  component: InvitationsPage,
});

function InvitationsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Convites" description="Gerenciar convites de acesso" />
      <div className="p-6 text-muted-foreground text-sm">
        Gerenciamento de convites em breve.
      </div>
    </div>
  );
}
