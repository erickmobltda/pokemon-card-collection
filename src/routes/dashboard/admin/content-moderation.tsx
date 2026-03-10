import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/dashboard/admin/content-moderation")({
  component: ContentModerationPage,
});

function ContentModerationPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Moderação de Conteúdo" />
      <div className="p-6 text-muted-foreground text-sm">Em breve.</div>
    </div>
  );
}
