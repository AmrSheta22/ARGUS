import { createServerFn } from "@tanstack/react-start";

import { adminMiddleware } from "#/lib/auth/middleware.ts";

import {
  summaryDeleteSchema,
  summaryInputSchema,
  summaryUpdateSchema,
  videoDeleteSchema,
  videoInputSchema,
  videoUpdateSchema,
  workDeleteSchema,
  workInputSchema,
  workUpdateSchema,
} from "../schemas.ts";
import { createSummary, deleteSummary, updateSummary } from "../summary.server.ts";
import { createVideo, deleteVideo, updateVideo } from "../video.server.ts";
import { createWork, deleteWork, updateWork } from "../work.server.ts";

export const $createWork = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(workInputSchema)
  .handler(async ({ data }) => {
    return createWork(data);
  });

export const $updateWork = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(workUpdateSchema)
  .handler(async ({ data }) => {
    return updateWork(data.id, data.data);
  });

export const $deleteWork = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(workDeleteSchema)
  .handler(async ({ data }) => {
    return deleteWork(data.id);
  });

export const $createVideo = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(videoInputSchema)
  .handler(async ({ data }) => {
    return createVideo(data);
  });

export const $updateVideo = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(videoUpdateSchema)
  .handler(async ({ data }) => {
    return updateVideo(data.id, data.data);
  });

export const $deleteVideo = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(videoDeleteSchema)
  .handler(async ({ data }) => {
    return deleteVideo(data.id);
  });

export const $createSummary = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(summaryInputSchema)
  .handler(async ({ data }) => {
    return createSummary(data);
  });

export const $updateSummary = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(summaryUpdateSchema)
  .handler(async ({ data }) => {
    return updateSummary(data.id, data.data);
  });

export const $deleteSummary = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(summaryDeleteSchema)
  .handler(async ({ data }) => {
    return deleteSummary(data.id);
  });
