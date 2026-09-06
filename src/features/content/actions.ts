import { createServerFn } from "@tanstack/react-start";

import { listWork } from "./work.server.ts";

export const $listPublishedWork = createServerFn({ method: "GET" }).handler(async () => {
  return listWork({ publishedOnly: true });
});
