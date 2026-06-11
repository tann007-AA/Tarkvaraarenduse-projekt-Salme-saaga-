CREATE TABLE `inventory_items` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`item_id` varchar(100) NOT NULL,
	`quantity` int DEFAULT 1,
	CONSTRAINT `inventory_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`save_id` varchar(36) NOT NULL,
	`current_chapter` int DEFAULT 1,
	`completed_quest_count` int DEFAULT 0,
	`completed_ending_a` boolean DEFAULT false,
	`completed_ending_b` boolean DEFAULT false,
	CONSTRAINT `progress_save_id` PRIMARY KEY(`save_id`)
);
--> statement-breakpoint
CREATE TABLE `saves` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`slot_number` int NOT NULL,
	`save_name` varchar(100),
	`play_time_seconds` int DEFAULT 0,
	`last_played_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saves_id` PRIMARY KEY(`id`)
);
