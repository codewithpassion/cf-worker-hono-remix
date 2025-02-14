import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const Roles = ["Super-Admin", "Admin", "User"] as const;
export type Role = typeof Roles[number];
export const users = sqliteTable("Users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  role: text("role", { enum: Roles }).notNull().default("User"),
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
export type ServiceDays = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
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


// ---------------------------------------
export type MapPoint = { lat: number, lng: number };
export type AddressConstraints = {
  truck_id?: string;
  serviceDay?: ServiceDays;
  timeWindow?: { start: string, end: string };
}
export const addresses = sqliteTable("Addresses", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  address: text().notNull(),
  gps: text({ mode: 'json' }).$type<MapPoint>(),
  constraints: text("constraints", { mode: 'json' }).$type<AddressConstraints>().default({}),
  visits: int().notNull(),
  allocatedTime: real().notNull(),
  isActive: int({ mode: 'boolean' }).notNull().default(true),
  created: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`),
  updated: int({ mode: 'timestamp' }).notNull().default(sql`(strftime('%s','now'))`).$onUpdate(() => new Date())
});
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
