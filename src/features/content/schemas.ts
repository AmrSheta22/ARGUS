import { z } from "zod";

export const workInputSchema = z.object({
  code: z.string().trim().min(1, "Code is required.").max(64),
  year: z.number().int().min(1000).max(2100),
  title: z.string().trim().min(1, "Title is required.").max(300),
  area: z.string().trim().min(1, "Area is required.").max(200),
  status: z.string().trim().min(1, "Status is required.").max(120),
  authors: z.array(z.string().trim().min(1)).min(1, "Add at least one author."),
  abstract: z.string().trim().min(1, "Abstract is required."),
  url: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Enter a valid URL or leave empty.",
    })
    .default(""),
  sortOrder: z.number().int().default(0),
});

export type WorkInput = z.infer<typeof workInputSchema>;

export const workUpdateSchema = z.object({
  id: z.number().int(),
  data: workInputSchema,
});

export const workDeleteSchema = z.object({
  id: z.number().int(),
});

export type Work = {
  id: number;
  code: string;
  year: number;
  title: string;
  area: string;
  status: string;
  authors: string[];
  abstract: string;
  url: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
