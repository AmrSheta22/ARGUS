import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  ContentEmptyState,
  ContentErrorState,
  ContentPage,
  SectionLabel,
} from "#/features/content/components/shared.tsx";
import { FeaturedWork, WorkCard, WorkSkeletons } from "#/features/content/components/work.tsx";
import { workQueryOptions } from "#/features/content/queries.ts";

export const Route = createFileRoute("/work")({
  loader: ({ context }) => context.queryClient.ensureQueryData(workQueryOptions()),
  component: WorkPage,
});

function WorkPage() {
  const { data, isPending, isError, refetch } = useQuery(workQueryOptions());

  return (
    <ContentPage title="Our work" description="Research work by the ARGUS NLP Group.">
      {isPending ? (
        <WorkSkeletons />
      ) : isError || !data ? (
        <ContentErrorState message="Failed to load research work." onRetry={refetch} />
      ) : data.length === 0 ? (
        <ContentEmptyState message="No research work yet." />
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
    </ContentPage>
  );
}
