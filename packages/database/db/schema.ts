import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("Users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  role: text("role", { enum: ["Suer-Admin","Admin", "User"] }).notNull().default("User"),
  isActive: int({mode: 'boolean'}).notNull().default(true),
  createdAt: int({mode: 'timestamp'}).notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: int({mode: 'timestamp'}).notNull().default(sql`(CURRENT_TIMESTAMP)`).$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});
export type User = typeof users.$inferSelect;

export const tokens = sqliteTable("Tokens", {
  token: text().primaryKey(),
  email: text().notNull(),
  type: text("type", { enum: ["access", "refresh"] }).notNull(),
  createdAt: int({mode: 'timestamp'}).notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
export type Token = typeof tokens.$inferSelect;

export const magicLinks = sqliteTable("MagicLinks", {
  token: text().notNull().primaryKey(),
  email: text().notNull(),
  createdAt: int({mode: 'timestamp'}).notNull().default(sql`(CURRENT_TIMESTAMP)`),
  expiresAt: int({mode: 'timestamp'}).notNull(),
  redirectUrl: text().notNull(),
});
export type MagicLink = typeof magicLinks.$inferSelect;