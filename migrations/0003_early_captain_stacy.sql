PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_MagicLinks` (
	`token` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`expiresAt` integer NOT NULL,
	`redirectUrl` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_MagicLinks`("token", "email", "createdAt", "expiresAt", "redirectUrl") SELECT "token", "email", "createdAt", "expiresAt", "redirectUrl" FROM `MagicLinks`;--> statement-breakpoint
DROP TABLE `MagicLinks`;--> statement-breakpoint
ALTER TABLE `__new_MagicLinks` RENAME TO `MagicLinks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_Tokens` (
	`token` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s','now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_Tokens`("token", "email", "type", "createdAt") SELECT "token", "email", "type", "createdAt" FROM `Tokens`;--> statement-breakpoint
DROP TABLE `Tokens`;--> statement-breakpoint
ALTER TABLE `__new_Tokens` RENAME TO `Tokens`;--> statement-breakpoint
CREATE TABLE `__new_Trucks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`truck_id` text NOT NULL,
	`capacity` integer NOT NULL,
	`type` text NOT NULL,
	`serviceDays` text DEFAULT '[]',
	`isActive` integer DEFAULT true NOT NULL,
	`comment` text,
	`created` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`updated` integer DEFAULT (strftime('%s','now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_Trucks`("id", "truck_id", "capacity", "type", "serviceDays", "isActive", "comment", "created", "updated") SELECT "id", "truck_id", "capacity", "type", "serviceDays", "isActive", "comment", "created", "updated" FROM `Trucks`;--> statement-breakpoint
DROP TABLE `Trucks`;--> statement-breakpoint
ALTER TABLE `__new_Trucks` RENAME TO `Trucks`;--> statement-breakpoint
CREATE UNIQUE INDEX `Trucks_truck_id_unique` ON `Trucks` (`truck_id`);--> statement-breakpoint
CREATE TABLE `__new_Users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'User' NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s','now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_Users`("id", "name", "email", "role", "isActive", "createdAt", "updatedAt") SELECT "id", "name", "email", "role", "isActive", "createdAt", "updatedAt" FROM `Users`;--> statement-breakpoint
DROP TABLE `Users`;--> statement-breakpoint
ALTER TABLE `__new_Users` RENAME TO `Users`;--> statement-breakpoint
CREATE UNIQUE INDEX `Users_email_unique` ON `Users` (`email`);