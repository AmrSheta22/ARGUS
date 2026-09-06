import { queryOptions } from "@tanstack/react-query";

import { $listSummaries, $listVideos, $listWork } from "./actions.ts";

export const workQueryKeys = {
  all: ["content", "work"] as const,
  list: () => [...workQueryKeys.all, "list"] as const,
};

export const workQueryOptions = () =>
  queryOptions({
    queryKey: workQueryKeys.list(),
    queryFn: ({ signal }) => $listWork({ signal }),
  });

export const videoQueryKeys = {
  all: ["content", "videos"] as const,
  list: () => [...videoQueryKeys.all, "list"] as const,
};

export const videoQueryOptions = () =>
  queryOptions({
    queryKey: videoQueryKeys.list(),
    queryFn: ({ signal }) => $listVideos({ signal }),
  });

export const summaryQueryKeys = {
  all: ["content", "summaries"] as const,
  list: () => [...summaryQueryKeys.all, "list"] as const,
};

export const summaryQueryOptions = () =>
  queryOptions({
    queryKey: summaryQueryKeys.list(),
    queryFn: ({ signal }) => $listSummaries({ signal }),
  });
