-- Add new columns to users table
ALTER TABLE `users` ADD `username` varchar(50) NOT NULL;
--> statement-breakpoint
ALTER TABLE `users` ADD `name` varchar(50) NOT NULL;
--> statement-breakpoint
ALTER TABLE `users` ADD `role` enum('user','admin') DEFAULT 'user';
--> statement-breakpoint
ALTER TABLE `users` ADD `last_login_at` timestamp;
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);
--> statement-breakpoint

-- Create sessions table
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
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
