import { pgTable, text, serial, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  long_description: text("long_description"),
  problem: text("problem"),
  solution: text("solution"),
  tech_stack: json("tech_stack").$type<string[]>().notNull().default([]),
  category: text("category"),
  status: text("status").notNull().default("active"),
  cover_image: text("cover_image"),
  gallery: json("gallery").$type<string[]>().notNull().default([]),
  github_url: text("github_url"),
  live_url: text("live_url"),
  featured: boolean("featured").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, created_at: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
