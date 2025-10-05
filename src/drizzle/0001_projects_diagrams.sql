-- Projects and Diagrams schema migration
CREATE TABLE IF NOT EXISTS `projects` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `description` text,
    `owner_id` text NOT NULL,
    `created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
    `updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
    FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `diagrams` (
    `id` text PRIMARY KEY NOT NULL,
    `project_id` text NOT NULL,
    `name` text NOT NULL,
    `nodes` text,
    `edges` text,
    `metadata` text,
    `created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
    `updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
-- Optional demo seed (idempotent-ish): insert if not exists by unique id checks
-- Note: D1 SQLite lacks INSERT ... ON CONFLICT DO NOTHING without unique constraint;
-- seeds should be handled by app scripts if strict idempotency is required.

