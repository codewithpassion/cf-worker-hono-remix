CREATE TABLE `Trucks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`truck_id` text NOT NULL,
	`capacity` integer NOT NULL,
	`type` text NOT NULL,
	`comment` text,
	`created` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Trucks_truck_id_unique` ON `Trucks` (`truck_id`);