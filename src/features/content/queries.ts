import { queryOptions } from "@tanstack/react-query";

import { $listPublishedWork } from "./actions.ts";

export const workQueryKeys = {
  published: ["content", "work", "published"] as const,
};

export const publishedWorkQueryOptions = () =>
  queryOptions({
    queryKey: workQueryKeys.published,
    queryFn: ({ signal }) => $listPublishedWork({ signal }),
  });
