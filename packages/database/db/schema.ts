import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("Users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  role: text("role", { enum: ["Super-Admin", "Admin", "User"] }).notNull().default("User"),
  isActive: int({ mode: 'boolean' }).notNull().default(true),
  createdAt: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`),
  updatedAt: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`).$onUpdate(() => new Date())
});
export type User = typeof users.$inferSelect;

export const tokens = sqliteTable("Tokens", {
  token: text().primaryKey(),
  email: text().notNull(),
  type: text("type", { enum: ["access", "refresh"] }).notNull(),
  createdAt: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`),
});
export type Token = typeof tokens.$inferSelect;

export const magicLinks = sqliteTable("MagicLinks", {
  token: text().notNull().primaryKey(),
  email: text().notNull(),
  createdAt: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`),
  expiresAt: int({ mode: 'timestamp' }).notNull(),
  redirectUrl: text().notNull(),
});
export type MagicLink = typeof magicLinks.$inferSelect;



// ---------------------------------------
export type ServiceDays = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export const trucks = sqliteTable("Trucks", {
  id: int().primaryKey({ autoIncrement: true }),
  truck_id: text().notNull().unique(),
  capacity: int().notNull(),
  type: text("type", { enum: ["R", "C"] }).notNull(),
  serviceDays: text("serviceDays", { mode: 'json' }).$type<ServiceDays[]>().default([]),
  isActive: int({ mode: 'boolean' }).notNull().default(true),
  comment: text(),
  created: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`),
  updated: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`).$onUpdate(() => new Date())
});
export type Truck = typeof trucks.$inferSelect;
export type NewTruck = typeof trucks.$inferInsert;
