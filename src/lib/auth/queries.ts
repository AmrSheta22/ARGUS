import { queryOptions } from "@tanstack/react-query";

import { $getSession } from "./functions";

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ["auth"],
    queryFn: ({ signal }) => $getSession({ signal }),
  });
