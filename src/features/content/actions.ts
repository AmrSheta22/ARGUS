import { createServerFn } from "@tanstack/react-start";

import { listVideos } from "./video.server.ts";
import { listWork } from "./work.server.ts";

export const $listWork = createServerFn({ method: "GET" }).handler(async () => {
  return listWork();
});

export const $listVideos = createServerFn({ method: "GET" }).handler(async () => {
  return listVideos();
});
