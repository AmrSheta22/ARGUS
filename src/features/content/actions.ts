import { createServerFn } from "@tanstack/react-start";

import { listWork } from "./work.server.ts";

export const $listWork = createServerFn({ method: "GET" }).handler(async () => {
  return listWork();
});
