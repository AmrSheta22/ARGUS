import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { KnowledgeDialog } from "#/features/content/admin/components/knowledge/knowledge-dialog.tsx";
import { KnowledgeTable } from "#/features/content/admin/components/knowledge/table.tsx";
import { knowledgeQueryOptions } from "#/features/content/queries.ts";
import type { Knowledge } from "#/features/content/schemas.ts";

export const Route = createFileRoute("/_auth/admin/knowledge")({
  component: KnowledgeRoute,
});

function KnowledgeRoute() {
  const { data, isPending, isError, refetch } = useQuery(knowledgeQueryOptions());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null);

  const openCreate = () => {
    setEditingKnowledge(null);
    setDialogOpen(true);
  };

  const openEdit = (knowledge: Knowledge) => {
    setEditingKnowledge(knowledge);
    setDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Knowledge</h1>
          <p className="text-sm text-muted-foreground">Manage curated knowledge paths.</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          New knowledge path
        </Button>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="flex flex-col items-center gap-2 rounded-none border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">Failed to load knowledge paths.</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <KnowledgeTable data={data} onEdit={openEdit} />
      )}

      <KnowledgeDialog
        knowledge={editingKnowledge}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
