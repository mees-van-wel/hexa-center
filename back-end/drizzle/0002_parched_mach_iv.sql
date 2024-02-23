DO $$ BEGIN
 CREATE TYPE "invoice_status" AS ENUM('draft', 'issued', 'credited');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "invoice_logs" RENAME TO "invoice_events";--> statement-breakpoint
ALTER TABLE "invoice_events" DROP CONSTRAINT "invoice_logs_created_by_id_relations_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice_events" DROP CONSTRAINT "invoice_logs_invoice_id_invoices_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "status" "invoice_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_events" ADD CONSTRAINT "invoice_events_created_by_id_relations_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_events" ADD CONSTRAINT "invoice_events_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
