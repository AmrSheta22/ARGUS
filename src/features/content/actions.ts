import { createServerFn } from "@tanstack/react-start";

import { listSummaries } from "./summary.server.ts";
import { listVideos } from "./video.server.ts";
import { listWork } from "./work.server.ts";

export const $listWork = createServerFn({ method: "GET" }).handler(async () => {
  return listWork();
});

export const $listVideos = createServerFn({ method: "GET" }).handler(async () => {
  return listVideos();
});

export const $listSummaries = createServerFn({ method: "GET" }).handler(async () => {
  return listSummaries();
});
