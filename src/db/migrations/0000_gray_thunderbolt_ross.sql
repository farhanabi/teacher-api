CREATE TABLE `registrations` (
	`teacher_id` int NOT NULL,
	`student_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `registrations_teacher_id_student_id_pk` PRIMARY KEY(`teacher_id`,`student_id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`suspended` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teachers_id` PRIMARY KEY(`id`),
	CONSTRAINT `teachers_email_unique` UNIQUE(`email`)
);
