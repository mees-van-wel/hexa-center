DO $$ BEGIN
 CREATE TYPE "invoice_adjustment_basis" AS ENUM('oneTime', 'perNight');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_adjustment_instance_ref_type" AS ENUM('reservation');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_adjustment_timing" AS ENUM('start', 'end', 'throughout');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_adjustment_type" AS ENUM('reservation');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_adjustment_unit" AS ENUM('currency', 'percentage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_adjustment_instances" (
	"$kind" text DEFAULT 'invoiceAdjustmentInstance' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"template_id" integer NOT NULL,
	"ref_type" "invoice_adjustment_instance_ref_type" NOT NULL,
	"ref_id" numeric NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"unit" "invoice_adjustment_unit" NOT NULL,
	"timing" "invoice_adjustment_timing" NOT NULL,
	"basis" "invoice_adjustment_basis" NOT NULL,
	"tax_percentage" numeric(10, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_adjustment_templates" (
	"$kind" text DEFAULT 'invoiceAdjustmentTemplate' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"type" "invoice_adjustment_type" NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"amount" numeric(10, 2) NOT NULL,
	"unit" "invoice_adjustment_unit" NOT NULL,
	"timing" "invoice_adjustment_timing" NOT NULL,
	"basis" "invoice_adjustment_basis" NOT NULL,
	"tax_percentage" numeric(10, 2) DEFAULT '0' NOT NULL,
	"auto_add" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DROP TABLE "reservation_charges" CASCADE;--> statement-breakpoint
DROP TABLE "reservations_to_reservation_charges" CASCADE;--> statement-breakpoint
ALTER TABLE "reservations" RENAME COLUMN "notes" TO "reservation_notes";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_events" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_lines" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "relations" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "working_hours" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "guest_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "invoice_notes" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_adjustment_instances" ADD CONSTRAINT "invoice_adjustment_instances_template_id_invoice_adjustment_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "invoice_adjustment_templates"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_adjustment_templates" ADD CONSTRAINT "invoice_adjustment_templates_created_by_id_relations_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_adjustment_templates" ADD CONSTRAINT "invoice_adjustment_templates_updated_by_id_relations_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
