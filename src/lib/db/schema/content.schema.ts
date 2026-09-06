import { sql } from "drizzle-orm";
import { index, integer, pgEnum, pgSequence, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { WORK_CONTENT_STATUSES } from "#/consts/content.ts";

export const workStatus = pgEnum("work_status", WORK_CONTENT_STATUSES);

export const workCodeSequence = pgSequence("work_code_seq", {
  startWith: 1,
  increment: 1,
});

export const videos = pgTable(
  "videos",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    source: text("source").notNull().default(""),
    topic: text("topic").notNull().default(""),
    durationMinutes: integer("duration_minutes").notNull().default(0),
    url: text("url").notNull().default(""),
    description: text("description").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("videos_sort_order_idx").on(table.sortOrder)],
);

export const summaries = pgTable(
  "summaries",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull().default(""),
    description: text("description").notNull(),
    url: text("url").notNull().default(""),
    tags: text("tags").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("summaries_sort_order_idx").on(table.sortOrder)],
);

export const knowledge = pgTable(
  "knowledge",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull().default(""),
    description: text("description").notNull(),
    url: text("url").notNull().default(""),
    tags: text("tags").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("knowledge_sort_order_idx").on(table.sortOrder)],
);

export const work = pgTable(
  "work",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: text("code")
      .notNull()
      .default(sql`'ARG-' || nextval('work_code_seq')`),
    year: integer("year").notNull(),
    title: text("title").notNull(),
    area: text("area").notNull().default(""),
    status: workStatus("status").notNull().default("under-review"),
    authors: text("authors").array().notNull().default([]),
    abstract: text("abstract").notNull(),
    url: text("url"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("work_sort_order_idx").on(table.sortOrder)],
);
