CREATE TABLE `dialogue_state` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`node_id` varchar(36) NOT NULL,
	`history` text,
	CONSTRAINT `dialogue_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_state` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`current_stage` int NOT NULL DEFAULT 0,
	`current_quest_id` varchar(36),
	`location` varchar(100),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_items` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`item_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	CONSTRAINT `inventory_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quest_state` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`quest_id` varchar(36) NOT NULL,
	`status` varchar(20) NOT NULL,
	`step` int NOT NULL DEFAULT 0,
	CONSTRAINT `quest_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `save_flags` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	CONSTRAINT `save_flags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saves` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`slot` int NOT NULL,
	`name` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scores` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `dialogue_state` ADD CONSTRAINT `dialogue_state_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_state` ADD CONSTRAINT `game_state_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quest_state` ADD CONSTRAINT `quest_state_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `save_flags` ADD CONSTRAINT `save_flags_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saves` ADD CONSTRAINT `saves_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE no action ON UPDATE no action;