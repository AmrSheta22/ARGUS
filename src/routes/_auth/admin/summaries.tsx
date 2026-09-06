import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { SummaryDialog } from "#/features/content/admin/components/summaries/summary-dialog.tsx";
import { SummaryTable } from "#/features/content/admin/components/summaries/table.tsx";
import { summaryQueryOptions } from "#/features/content/queries.ts";
import type { Summary } from "#/features/content/schemas.ts";

export const Route = createFileRoute("/_auth/admin/summaries")({
  component: SummariesRoute,
});

function SummariesRoute() {
  const { data, isPending, isError, refetch } = useQuery(summaryQueryOptions());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null);

  const openCreate = () => {
    setEditingSummary(null);
    setDialogOpen(true);
  };

  const openEdit = (summary: Summary) => {
    setEditingSummary(summary);
    setDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Summaries</h1>
          <p className="text-sm text-muted-foreground">Manage curated paper summaries.</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          New summary
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
          <p className="text-sm text-muted-foreground">Failed to load summaries.</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <SummaryTable data={data} onEdit={openEdit} />
      )}

      <SummaryDialog summary={editingSummary} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
