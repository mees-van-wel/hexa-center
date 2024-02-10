ALTER TABLE "invoices" DROP CONSTRAINT "invoices_updated_by_id_relations_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "updated_by_id";