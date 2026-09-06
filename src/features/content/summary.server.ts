import "@tanstack/react-start/server-only";
import { desc, eq } from "drizzle-orm";

import { toDto } from "#/lib/db/dto.ts";
import { db } from "#/lib/db/index.ts";
import { summaries } from "#/lib/db/schema/index.ts";

import type { Summary, SummaryInput } from "./schemas.ts";

export async function listSummaries(): Promise<Summary[]> {
  const rows = await db
    .select()
    .from(summaries)
    .orderBy(desc(summaries.sortOrder), desc(summaries.id));

  return rows.map(toDto);
}

export async function createSummary(input: SummaryInput): Promise<Summary> {
  const [row] = await db
    .insert(summaries)
    .values({ ...input, tags: input.tags.join(", ") })
    .returning();

  return toDto(row);
}

export async function updateSummary(id: number, input: SummaryInput): Promise<Summary | null> {
  const [row] = await db
    .update(summaries)
    .set({
      ...input,
      tags: input.tags.join(", "),
      updatedAt: new Date(),
    })
    .where(eq(summaries.id, id))
    .returning();

  return row ? toDto(row) : null;
}

export async function deleteSummary(id: number): Promise<boolean> {
  const rows = await db
    .delete(summaries)
    .where(eq(summaries.id, id))
    .returning({ id: summaries.id });
  return rows.length > 0;
}
