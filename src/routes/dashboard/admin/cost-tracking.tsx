import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/dashboard/admin/cost-tracking")({
  component: CostTrackingPage,
});

function CostTrackingPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Rastreamento de Custos" />
      <div className="p-6 text-muted-foreground text-sm">Em breve.</div>
    </div>
  );
}
