import { queryOptions } from "@tanstack/react-query";

import { $getContentOverview } from "./actions.ts";

export const contentOverviewQueryKeys = {
  all: ["admin", "content", "overview"] as const,
};

export const contentOverviewQueryOptions = () =>
  queryOptions({
    queryKey: contentOverviewQueryKeys.all,
    queryFn: ({ signal }) => $getContentOverview({ signal }),
  });
