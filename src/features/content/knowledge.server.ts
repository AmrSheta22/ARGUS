import "@tanstack/react-start/server-only";
import { desc, eq } from "drizzle-orm";

import { toDto } from "#/lib/db/dto.ts";
import { db } from "#/lib/db/index.ts";
import { knowledge } from "#/lib/db/schema/index.ts";

import type { Knowledge, KnowledgeInput } from "./schemas.ts";

export async function listKnowledge(): Promise<Knowledge[]> {
  const rows = await db
    .select()
    .from(knowledge)
    .orderBy(desc(knowledge.sortOrder), desc(knowledge.id));

  return rows.map(toDto);
}

export async function createKnowledge(input: KnowledgeInput): Promise<Knowledge> {
  const [row] = await db
    .insert(knowledge)
    .values({ ...input, tags: input.tags.join(", ") })
    .returning();

  return toDto(row);
}

export async function updateKnowledge(
  id: number,
  input: KnowledgeInput,
): Promise<Knowledge | null> {
  const [row] = await db
    .update(knowledge)
    .set({
      ...input,
      tags: input.tags.join(", "),
      updatedAt: new Date(),
    })
    .where(eq(knowledge.id, id))
    .returning();

  return row ? toDto(row) : null;
}

export async function deleteKnowledge(id: number): Promise<boolean> {
  const rows = await db
    .delete(knowledge)
    .where(eq(knowledge.id, id))
    .returning({ id: knowledge.id });
  return rows.length > 0;
}
