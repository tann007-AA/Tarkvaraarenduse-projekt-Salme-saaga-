ALTER TABLE `inventory_items` MODIFY COLUMN `quantity` int NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `progress` MODIFY COLUMN `current_chapter` int NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `progress` MODIFY COLUMN `completed_quest_count` int NOT NULL;--> statement-breakpoint
ALTER TABLE `progress` MODIFY COLUMN `completed_ending_a` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `progress` MODIFY COLUMN `completed_ending_b` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `saves` MODIFY COLUMN `play_time_seconds` int NOT NULL;--> statement-breakpoint
ALTER TABLE `inventory_items` ADD CONSTRAINT `unique_item_per_save` UNIQUE(`save_id`,`item_id`);--> statement-breakpoint
ALTER TABLE `saves` ADD CONSTRAINT `unique_user_slot` UNIQUE(`user_id`,`slot_number`);--> statement-breakpoint
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress` ADD CONSTRAINT `progress_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saves` ADD CONSTRAINT `saves_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `inventory_save_id_idx` ON `inventory_items` (`save_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `saves` (`user_id`);