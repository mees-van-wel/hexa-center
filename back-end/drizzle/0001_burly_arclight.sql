DO $$ BEGIN
 CREATE TYPE "setting_name" AS ENUM('invoiceEmailTitle', 'invoiceEmailContent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"updated_by_id" integer,
	"name" "setting_name" NOT NULL,
	"value" jsonb
);
--> statement-breakpoint
ALTER TABLE "invoice_logs" RENAME COLUMN "refType" TO "ref_type";--> statement-breakpoint
ALTER TABLE "invoice_logs" ALTER COLUMN "ref_type" SET DATA TYPE invoice_log_ref_type;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "settings" ADD CONSTRAINT "settings_updated_by_id_relations_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
