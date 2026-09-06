import { z } from "zod";

import { WORK_CONTENT_STATUSES } from "#/consts/content.ts";
import type { Dto } from "#/lib/db/dto.ts";
import type { summaries, videos, work } from "#/lib/db/schema/index.ts";

export const workInputSchema = z.object({
  year: z.number().int().min(1000).max(2100),
  title: z.string().trim().min(1, "Title is required.").max(300),
  area: z.string().trim().min(1, "Area is required.").max(200),
  status: z.enum(WORK_CONTENT_STATUSES, "Status is required."),
  authors: z.array(z.string().trim().min(1)).min(1, "Add at least one author."),
  abstract: z.string().trim().min(1, "Abstract is required."),
  url: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Enter a valid URL or leave empty.",
    }),
});

export type WorkInput = z.infer<typeof workInputSchema>;

export const workUpdateSchema = z.object({
  id: z.number().int(),
  data: workInputSchema,
});

export const workDeleteSchema = z.object({
  id: z.number().int(),
});

export type Work = Dto<typeof work.$inferSelect>;

export const videoInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(300),
  source: z.string().trim().max(200),
  topic: z.string().trim().max(200),
  durationMinutes: z.number().int().min(0),
  url: z
    .string()
    .trim()
    .min(1, "Video URL is required.")
    .max(1000)
    .refine((value) => z.url().safeParse(value).success, {
      message: "Enter a valid URL.",
    }),
  description: z.string().trim().min(1, "Description is required."),
});

export type VideoInput = z.infer<typeof videoInputSchema>;

export const videoUpdateSchema = z.object({
  id: z.number().int(),
  data: videoInputSchema,
});

export const videoDeleteSchema = z.object({
  id: z.number().int(),
});

export type Video = Dto<typeof videos.$inferSelect>;

export const summaryInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(300),
  subtitle: z.string().trim().max(500),
  description: z.string().trim().min(1, "Description is required."),
  url: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Enter a valid URL or leave empty.",
    }),
  tags: z.array(z.string().trim().min(1, "Tag is required.").max(100)).max(30),
});

export type SummaryInput = z.infer<typeof summaryInputSchema>;

export const summaryUpdateSchema = z.object({
  id: z.number().int(),
  data: summaryInputSchema,
});

export const summaryDeleteSchema = z.object({
  id: z.number().int(),
});

export type Summary = Dto<typeof summaries.$inferSelect>;
