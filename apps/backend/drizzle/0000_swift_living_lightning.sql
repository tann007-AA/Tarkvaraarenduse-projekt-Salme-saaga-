CREATE TABLE `game_sessions` (
	`id` varchar(36) NOT NULL,
	`lobby_id` varchar(36) NOT NULL,
	`attacker_id` varchar(36) NOT NULL,
	`defender_id` varchar(36) NOT NULL,
	`board_state` json NOT NULL,
	`current_turn` enum('attacker','defender') NOT NULL DEFAULT 'attacker',
	`status` enum('active','finished','abandoned') NOT NULL DEFAULT 'active',
	`winner_id` varchar(36),
	`win_reason` enum('king_escaped','king_captured','forfeit','disconnect'),
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`ended_at` timestamp,
	CONSTRAINT `game_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_items` (
	`id` varchar(36) NOT NULL,
	`save_id` varchar(36) NOT NULL,
	`item_id` varchar(100) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	CONSTRAINT `inventory_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_item_per_save` UNIQUE(`save_id`,`item_id`)
);
--> statement-breakpoint
CREATE TABLE `lobbies` (
	`id` varchar(36) NOT NULL,
	`code` char(4) NOT NULL,
	`host_id` varchar(36) NOT NULL,
	`guest_id` varchar(36),
	`status` enum('waiting','starting','active','abandoned') NOT NULL DEFAULT 'waiting',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lobbies_id` PRIMARY KEY(`id`),
	CONSTRAINT `lobbies_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `moves` (
	`id` varchar(36) NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`player_id` varchar(36) NOT NULL,
	`move_number` int NOT NULL,
	`from_row` int NOT NULL,
	`from_col` int NOT NULL,
	`to_row` int NOT NULL,
	`to_col` int NOT NULL,
	`captured_pieces` json,
	`board_snapshot` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` varchar(36) NOT NULL,
	`token` varchar(36) NOT NULL,
	`name` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `players_id` PRIMARY KEY(`id`),
	CONSTRAINT `players_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`save_id` varchar(36) NOT NULL,
	`current_chapter` int NOT NULL DEFAULT 1,
	`completed_quest_count` int NOT NULL DEFAULT 0,
	`completed_ending_a` boolean NOT NULL DEFAULT false,
	`completed_ending_b` boolean NOT NULL DEFAULT false,
	CONSTRAINT `progress_save_id` PRIMARY KEY(`save_id`)
);
--> statement-breakpoint
CREATE TABLE `saves` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`slot_number` int NOT NULL,
	`save_name` varchar(100),
	`play_time_seconds` int NOT NULL DEFAULT 0,
	`last_played_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saves_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_slot` UNIQUE(`user_id`,`slot_number`)
);
--> statement-breakpoint
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
CREATE TABLE `sessions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`refresh_token_hash` varchar(255) NOT NULL,
	`access_token_jti` varchar(36) NOT NULL,
	`user_agent` text,
	`ip_address` varchar(45),
	`remember_me` boolean DEFAULT false,
	`expires_at` timestamp NOT NULL,
	`last_activity_at` timestamp DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`username` varchar(50) NOT NULL,
	`name` varchar(50) NOT NULL,
	`role` enum('user','admin') DEFAULT 'user',
	`password_hash` varchar(255) NOT NULL,
	`last_login_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_lobby_id_lobbies_id_fk` FOREIGN KEY (`lobby_id`) REFERENCES `lobbies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_attacker_id_players_id_fk` FOREIGN KEY (`attacker_id`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_defender_id_players_id_fk` FOREIGN KEY (`defender_id`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_winner_id_players_id_fk` FOREIGN KEY (`winner_id`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lobbies` ADD CONSTRAINT `lobbies_host_id_players_id_fk` FOREIGN KEY (`host_id`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lobbies` ADD CONSTRAINT `lobbies_guest_id_players_id_fk` FOREIGN KEY (`guest_id`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moves` ADD CONSTRAINT `moves_session_id_game_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moves` ADD CONSTRAINT `moves_player_id_players_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress` ADD CONSTRAINT `progress_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saves` ADD CONSTRAINT `saves_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_save_id_saves_id_fk` FOREIGN KEY (`save_id`) REFERENCES `saves`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `inventory_save_id_idx` ON `inventory_items` (`save_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `saves` (`user_id`);--> statement-breakpoint
CREATE INDEX `save_id_idx` ON `scores` (`save_id`);