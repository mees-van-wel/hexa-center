ALTER TABLE "invoices" RENAME COLUMN "state" TO "status";--> statement-breakpoint
ALTER TABLE "relations" ALTER COLUMN "name" SET NOT NULL;