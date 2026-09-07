import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { StatCards } from "#/features/content/admin/components/dashboard/stat-cards.tsx";
import { contentOverviewQueryOptions } from "#/features/content/admin/queries.ts";

export const Route = createFileRoute("/_auth/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  const overviewQuery = useQuery(contentOverviewQueryOptions());

  const work = overviewQuery.data?.work ?? [];
  const videos = overviewQuery.data?.videos ?? [];
  const summaries = overviewQuery.data?.summaries ?? [];
  const knowledge = overviewQuery.data?.knowledge ?? [];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of the content published across the site.
        </p>
      </div>

      {overviewQuery.isPending ? (
        <div className="grid gap-4 pb-2 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
      ) : overviewQuery.isError ? (
        <div className="flex flex-col items-center gap-2 rounded-none border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">Failed to load dashboard data.</p>
          <Button variant="outline" size="sm" onClick={() => void overviewQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <StatCards work={work} videos={videos} summaries={summaries} knowledge={knowledge} />
      )}
    </div>
  );
}
