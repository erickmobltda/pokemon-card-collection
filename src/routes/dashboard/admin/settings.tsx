import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/dashboard/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Configurações do Sistema" description="Configurações globais da aplicação" />
      <div className="p-6 text-muted-foreground text-sm">
        Configurações do sistema em breve.
      </div>
    </div>
  );
}
