CREATE TABLE `scores` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`achieved_at` timestamp DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `scores` (`user_id`);--> statement-breakpoint
CREATE INDEX `save_id_idx` ON `scores` (`save_id`);