import "@tanstack/react-start/server-only";
import { desc, eq } from "drizzle-orm";

import { toDto } from "#/lib/db/dto.ts";
import { db } from "#/lib/db/index.ts";
import { work } from "#/lib/db/schema/index.ts";

import type { Work, WorkInput } from "./schemas.ts";

export async function listWork(): Promise<Work[]> {
  const rows = await db.select().from(work).orderBy(desc(work.sortOrder), desc(work.id));

  return rows.map(toDto);
}

export async function createWork(input: WorkInput): Promise<Work> {
  const [row] = await db.insert(work).values(input).returning();

  return toDto(row);
}

export async function updateWork(id: number, input: WorkInput): Promise<Work | null> {
  const [row] = await db
    .update(work)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(work.id, id))
    .returning();

  return row ? toDto(row) : null;
}

export async function deleteWork(id: number): Promise<boolean> {
  const rows = await db.delete(work).where(eq(work.id, id)).returning({ id: work.id });
  return rows.length > 0;
}
