import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  ContentEmptyState,
  ContentErrorState,
  ContentPage,
  SectionLabel,
} from "#/features/content/components/shared.tsx";
import { FeaturedVideo, VideoCard, VideoSkeletons } from "#/features/content/components/videos.tsx";
import { videoQueryOptions } from "#/features/content/queries.ts";

export const Route = createFileRoute("/videos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(videoQueryOptions()),
  component: VideosPage,
});

function VideosPage() {
  const { data, isPending, isError, refetch } = useQuery(videoQueryOptions());

  return (
    <ContentPage
      title="Videos"
      description="Curated talks, tutorials, and recordings by the ARGUS NLP Group."
    >
      {isPending ? (
        <VideoSkeletons />
      ) : isError || !data ? (
        <ContentErrorState message="Failed to load videos." onRetry={refetch} />
      ) : data.length === 0 ? (
        <ContentEmptyState message="No videos yet." />
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          <FeaturedVideo item={data[0]} />

          {data.length > 1 ? (
            <section className="flex flex-col gap-5">
              <SectionLabel>All videos</SectionLabel>
              <div className="columns-1 gap-4 md:columns-2">
                {data.slice(1).map((item) => (
                  <VideoCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </ContentPage>
  );
}
