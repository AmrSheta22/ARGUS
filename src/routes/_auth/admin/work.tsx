import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { WorkTable } from "#/features/content/admin/components/work/table.tsx";
import { WorkDialog } from "#/features/content/admin/components/work/work-dialog.tsx";
import { workQueryOptions } from "#/features/content/queries.ts";
import type { Work } from "#/features/content/schemas.ts";

export const Route = createFileRoute("/_auth/admin/work")({
  component: WorkRoute,
});

function WorkRoute() {
  const { data, isPending, isError, refetch } = useQuery(workQueryOptions());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);

  const openCreate = () => {
    setEditingWork(null);
    setDialogOpen(true);
  };

  const openEdit = (work: Work) => {
    setEditingWork(work);
    setDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Our Work</h1>
          <p className="text-sm text-muted-foreground">
            Manage research work items, including drafts.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          New work
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
          <p className="text-sm text-muted-foreground">Failed to load work items.</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <WorkTable data={data} onEdit={openEdit} />
      )}

      <WorkDialog work={editingWork} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
