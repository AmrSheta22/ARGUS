import { queryOptions } from "@tanstack/react-query";

import { $listWork } from "./actions.ts";

export const workQueryKeys = {
  all: ["content", "work"] as const,
  list: () => [...workQueryKeys.all, "list"] as const,
};

export const workQueryOptions = () =>
  queryOptions({
    queryKey: workQueryKeys.list(),
    queryFn: ({ signal }) => $listWork({ signal }),
  });
