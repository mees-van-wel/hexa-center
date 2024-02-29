DO $$ BEGIN
 CREATE TYPE "reservations_to_invoice_extra_instances_basis" AS ENUM('oneTime', 'perNight');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "reservations_to_invoice_extra_instances_status" AS ENUM('notApplied', 'inProgress', 'applied');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "reservations_to_invoice_extra_instances_timing" AS ENUM('throughout', 'end');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations_to_invoice_extra_instances" (
	"reservation_id" integer NOT NULL,
	"instance_id" integer NOT NULL,
	"basis" "reservations_to_invoice_extra_instances_basis" NOT NULL,
	"timing" "reservations_to_invoice_extra_instances_timing" NOT NULL,
	"status" "reservations_to_invoice_extra_instances_status" DEFAULT 'notApplied' NOT NULL,
	CONSTRAINT "reservations_to_invoice_extra_instances_reservation_id_instance_id_pk" PRIMARY KEY("reservation_id","instance_id")
);
--> statement-breakpoint
ALTER TABLE "invoice_extra_instances" RENAME COLUMN "tax_percentage" TO "vat_percentage";--> statement-breakpoint
ALTER TABLE "invoice_extra_templates" RENAME COLUMN "tax_percentage" TO "vat_percentage";--> statement-breakpoint
ALTER TABLE "invoice_lines" RENAME COLUMN "unit_net_amount" TO "unit_amount";--> statement-breakpoint
ALTER TABLE "invoice_lines" RENAME COLUMN "total_net_amount" TO "net_amount";--> statement-breakpoint
ALTER TABLE "invoice_lines" RENAME COLUMN "total_tax_amount" TO "vat_amount";--> statement-breakpoint
ALTER TABLE "invoice_lines" RENAME COLUMN "tax_percentage" TO "vat_percentage";--> statement-breakpoint
ALTER TABLE "invoice_lines" RENAME COLUMN "total_gross_amount" TO "gross_amount";--> statement-breakpoint
ALTER TABLE "invoices" RENAME COLUMN "total_net_amount" TO "net_amount";--> statement-breakpoint
ALTER TABLE "invoices" RENAME COLUMN "total_tax_amount" TO "vat_amount";--> statement-breakpoint
ALTER TABLE "invoices" RENAME COLUMN "total_gross_amount" TO "gross_amount";--> statement-breakpoint
ALTER TABLE "invoice_extra_instances" ADD COLUMN "quantity" numeric(10, 2) DEFAULT '1' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_extra_instances" DROP COLUMN IF EXISTS "ref_type";--> statement-breakpoint
ALTER TABLE "invoice_extra_instances" DROP COLUMN IF EXISTS "ref_id";--> statement-breakpoint
ALTER TABLE "invoice_extra_instances" DROP COLUMN IF EXISTS "basis";--> statement-breakpoint
ALTER TABLE "invoice_extra_instances" DROP COLUMN IF EXISTS "timing";--> statement-breakpoint
ALTER TABLE "invoice_extra_templates" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "invoice_extra_templates" DROP COLUMN IF EXISTS "basis";--> statement-breakpoint
ALTER TABLE "invoice_extra_templates" DROP COLUMN IF EXISTS "timing";--> statement-breakpoint
ALTER TABLE "invoice_extra_templates" DROP COLUMN IF EXISTS "auto_add";--> statement-breakpoint
ALTER TABLE "invoice_lines" DROP COLUMN IF EXISTS "discount_amount";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "discount_amount";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "total_discount_amount";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_invoice_extra_instances" ADD CONSTRAINT "reservations_to_invoice_extra_instances_reservation_id_invoice_extra_templates_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "invoice_extra_templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_invoice_extra_instances" ADD CONSTRAINT "reservations_to_invoice_extra_instances_instance_id_invoice_extra_templates_id_fk" FOREIGN KEY ("instance_id") REFERENCES "invoice_extra_templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
