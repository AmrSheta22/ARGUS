import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  ContentEmptyState,
  ContentErrorState,
  ContentGrid,
  ContentPage,
  ContentSection,
  ContentStack,
} from "#/features/content/components/shared.tsx";
import {
  FeaturedSummary,
  SummaryCard,
  SummarySkeletons,
} from "#/features/content/components/summaries.tsx";
import { summaryQueryOptions } from "#/features/content/queries.ts";

export const Route = createFileRoute("/_sharedLayout/_public/summaries")({
  loader: ({ context }) => context.queryClient.ensureQueryData(summaryQueryOptions()),
  component: SummariesPage,
});

function SummariesPage() {
  const { data, isPending, isError, refetch } = useQuery(summaryQueryOptions());

  return (
    <ContentPage
      title="Paper summaries"
      description="Concise, curated summaries of NLP research papers by the ARGUS NLP Group."
    >
      {isPending ? (
        <SummarySkeletons />
      ) : isError || !data ? (
        <ContentErrorState message="Failed to load summaries." onRetry={refetch} />
      ) : data.length === 0 ? (
        <ContentEmptyState message="No summaries yet." />
      ) : (
        <ContentStack>
          <FeaturedSummary item={data[0]} />

          {data.length > 1 ? (
            <ContentSection label="All summaries">
              <ContentGrid>
                {data.slice(1).map((item) => (
                  <SummaryCard key={item.id} item={item} />
                ))}
              </ContentGrid>
            </ContentSection>
          ) : null}
        </ContentStack>
      )}
    </ContentPage>
  );
}
