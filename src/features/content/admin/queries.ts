import { queryOptions } from "@tanstack/react-query";

import { $listWork } from "./actions.ts";

export const adminWorkQueryKeys = {
  all: ["content", "admin", "work"] as const,
  list: () => [...adminWorkQueryKeys.all, "list"] as const,
};

export const adminWorkQueryOptions = () =>
  queryOptions({
    queryKey: adminWorkQueryKeys.list(),
    queryFn: ({ signal }) => $listWork({ signal }),
  });
