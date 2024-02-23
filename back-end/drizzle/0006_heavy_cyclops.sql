DO $$ BEGIN
 CREATE TYPE "invoice_event_ref_type" AS ENUM('invoice');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_event_type" AS ENUM('issued', 'mailed', 'credited');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "invoice_events"
ALTER COLUMN "type"
SET DATA TYPE invoice_event_type USING (type::text::invoice_event_type);
--> statement-breakpoint
ALTER TABLE "invoice_events"
ALTER COLUMN "ref_type"
SET DATA TYPE invoice_event_ref_type USING (ref_type::text::invoice_event_ref_type);