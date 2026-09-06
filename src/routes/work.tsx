import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "#/components/ui/button.tsx";
import { SectionLabel } from "#/features/content/components/shared.tsx";
import { FeaturedWork, WorkCard, WorkSkeletons } from "#/features/content/components/work.tsx";
import { workQueryOptions } from "#/features/content/queries.ts";

export const Route = createFileRoute("/work")({
  loader: ({ context }) => context.queryClient.ensureQueryData(workQueryOptions()),
  component: WorkPage,
});

function WorkPage() {
  const { data, isPending, isError, refetch } = useQuery(workQueryOptions());

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col bg-background px-6 py-10">
      <section className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Our work</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Research work by the ARGUS NLP Group.
        </p>
      </section>

      {isPending ? (
        <WorkSkeletons />
      ) : isError || !data ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-none border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Failed to load research work.</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-2 rounded-none border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">No research work yet.</p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          <FeaturedWork item={data[0]} />

          {data.length > 1 ? (
            <section className="flex flex-col gap-5">
              <SectionLabel>All publications</SectionLabel>
              <div className="columns-1 gap-4 md:columns-2">
                {data.slice(1).map((item) => (
                  <WorkCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
