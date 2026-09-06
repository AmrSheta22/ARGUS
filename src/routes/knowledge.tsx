import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  FeaturedKnowledge,
  KnowledgeCard,
  KnowledgeSkeletons,
} from "#/features/content/components/knowledge.tsx";
import {
  ContentEmptyState,
  ContentErrorState,
  ContentPage,
  SectionLabel,
} from "#/features/content/components/shared.tsx";
import { knowledgeQueryOptions } from "#/features/content/queries.ts";

export const Route = createFileRoute("/knowledge")({
  loader: ({ context }) => context.queryClient.ensureQueryData(knowledgeQueryOptions()),
  component: KnowledgePage,
});

function KnowledgePage() {
  const { data, isPending, isError, refetch } = useQuery(knowledgeQueryOptions());

  return (
    <ContentPage
      title="Foundational knowledge"
      description="Guided learning paths and resources to build a strong foundation in NLP and machine learning, curated by the ARGUS NLP Group."
    >
      {isPending ? (
        <KnowledgeSkeletons />
      ) : isError || !data ? (
        <ContentErrorState message="Failed to load knowledge paths." onRetry={refetch} />
      ) : data.length === 0 ? (
        <ContentEmptyState message="No knowledge paths yet." />
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          <FeaturedKnowledge item={data[0]} />

          {data.length > 1 ? (
            <section className="flex flex-col gap-5">
              <SectionLabel>All paths</SectionLabel>
              <div className="columns-1 gap-4 md:columns-2">
                {data.slice(1).map((item) => (
                  <KnowledgeCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </ContentPage>
  );
}
