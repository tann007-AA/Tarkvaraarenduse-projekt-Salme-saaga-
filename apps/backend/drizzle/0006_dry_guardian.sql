CREATE TABLE `scores` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`score_type` varchar(50) NOT NULL,
	`score_value` int NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_save_score` UNIQUE(`save_id`,`score_type`)
);
--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `save_id_idx` ON `scores` (`save_id`);