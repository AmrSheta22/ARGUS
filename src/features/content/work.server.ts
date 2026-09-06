import "@tanstack/react-start/server-only";
import { desc, eq } from "drizzle-orm";

import { db } from "#/lib/db/index.ts";
import { work } from "#/lib/db/schema/index.ts";

import type { Work, WorkInput } from "./schemas.ts";

type WorkRow = typeof work.$inferSelect;

function toWork(row: WorkRow): Work {
  return {
    id: row.id,
    code: row.code,
    year: row.year,
    title: row.title,
    area: row.area,
    status: row.status,
    authors: row.authors,
    abstract: row.abstract,
    url: row.url,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toValues(input: WorkInput) {
  return {
    code: input.code,
    year: input.year,
    title: input.title,
    area: input.area,
    status: input.status,
    authors: input.authors,
    abstract: input.abstract,
    url: input.url || null,
    published: input.published,
    sortOrder: input.sortOrder,
  };
}

export async function listWork({ publishedOnly }: { publishedOnly: boolean }): Promise<Work[]> {
  const query = db.select().from(work);
  const rows = publishedOnly
    ? await query.where(eq(work.published, true)).orderBy(desc(work.sortOrder), desc(work.id))
    : await query.orderBy(desc(work.sortOrder), desc(work.id));

  return rows.map(toWork);
}

export async function createWork(input: WorkInput): Promise<Work> {
  const [row] = await db.insert(work).values(toValues(input)).returning();
  return toWork(row);
}

export async function updateWork(id: number, input: WorkInput): Promise<Work | null> {
  const [row] = await db
    .update(work)
    .set({
      ...toValues(input),
      updatedAt: new Date(),
    })
    .where(eq(work.id, id))
    .returning();

  return row ? toWork(row) : null;
}

export async function deleteWork(id: number): Promise<boolean> {
  const rows = await db.delete(work).where(eq(work.id, id)).returning({ id: work.id });
  return rows.length > 0;
}
