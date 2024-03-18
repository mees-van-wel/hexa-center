ALTER TABLE "invoice_lines" ALTER COLUMN "vat_rate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_instances" ALTER COLUMN "vat_rate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_templates" ALTER COLUMN "vat_rate" DROP NOT NULL;