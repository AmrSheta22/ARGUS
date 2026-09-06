import { createServerFn } from "@tanstack/react-start";

import { adminMiddleware } from "#/lib/auth/middleware.ts";

import { workDeleteSchema, workInputSchema, workUpdateSchema } from "../schemas.ts";
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
