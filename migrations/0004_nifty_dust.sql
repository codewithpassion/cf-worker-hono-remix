CREATE TABLE `Addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`gps` text,
	`constraints` text DEFAULT '{}',
	`visits` integer NOT NULL,
	`allocatedTime` real NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`created` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`updated` integer DEFAULT (strftime('%s','now')) NOT NULL
);
