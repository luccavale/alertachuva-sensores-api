CREATE TABLE `bairros` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`cidade` text DEFAULT 'São Paulo' NOT NULL,
	`criado_em` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leituras` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sensor_id` integer NOT NULL,
	`chuva_mm_h` real NOT NULL,
	`nivel_agua_cm` real NOT NULL,
	`registrada_em` text NOT NULL,
	FOREIGN KEY (`sensor_id`) REFERENCES `sensores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sensores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo` text NOT NULL,
	`descricao` text,
	`ativo` integer DEFAULT true NOT NULL,
	`bairro_id` integer NOT NULL,
	FOREIGN KEY (`bairro_id`) REFERENCES `bairros`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sensores_codigo_unique` ON `sensores` (`codigo`);