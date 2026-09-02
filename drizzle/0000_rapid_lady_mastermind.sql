CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`service_id` text NOT NULL,
	`service_name` text NOT NULL,
	`duration` integer NOT NULL,
	`barber_id` text NOT NULL,
	`barber_name` text NOT NULL,
	`appointment_date` text NOT NULL,
	`start_time` text NOT NULL,
	`status` text DEFAULT 'confirmado' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_appointments_date_barber` ON `appointments` (`appointment_date`,`barber_id`);--> statement-breakpoint
CREATE INDEX `idx_appointments_status_date` ON `appointments` (`status`,`appointment_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_appointments_active_slot` ON `appointments` (`barber_id`,`appointment_date`,`start_time`) WHERE "appointments"."status" <> 'cancelado';