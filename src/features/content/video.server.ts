import "@tanstack/react-start/server-only";
import { desc, eq } from "drizzle-orm";

import { toDto } from "#/lib/db/dto.ts";
import { db } from "#/lib/db/index.ts";
import { videos } from "#/lib/db/schema/index.ts";

import type { Video, VideoInput } from "./schemas.ts";

export async function listVideos(): Promise<Video[]> {
  const rows = await db.select().from(videos).orderBy(desc(videos.sortOrder), desc(videos.id));

  return rows.map(toDto);
}

export async function createVideo(input: VideoInput): Promise<Video> {
  const [row] = await db.insert(videos).values(input).returning();

  return toDto(row);
}

export async function updateVideo(id: number, input: VideoInput): Promise<Video | null> {
  const [row] = await db
    .update(videos)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(videos.id, id))
    .returning();

  return row ? toDto(row) : null;
}

export async function deleteVideo(id: number): Promise<boolean> {
  const rows = await db.delete(videos).where(eq(videos.id, id)).returning({ id: videos.id });
  return rows.length > 0;
}
