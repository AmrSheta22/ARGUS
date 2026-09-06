import { pgTable, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";

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
    published: boolean("published").default(true).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("videos_published_sort_order_idx").on(table.published, table.sortOrder)],
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
    published: boolean("published").default(true).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("summaries_published_sort_order_idx").on(table.published, table.sortOrder)],
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
    published: boolean("published").default(true).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("knowledge_published_sort_order_idx").on(table.published, table.sortOrder)],
);

export const work = pgTable(
  "work",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: text("code").notNull(),
    year: integer("year").notNull(),
    title: text("title").notNull(),
    area: text("area").notNull().default(""),
    status: text("status").notNull().default(""),
    authors: text("authors").array().notNull().default([]),
    abstract: text("abstract").notNull(),
    url: text("url"),
    published: boolean("published").default(true).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("work_published_sort_order_idx").on(table.published, table.sortOrder)],
);
