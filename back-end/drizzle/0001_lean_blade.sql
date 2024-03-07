ALTER TYPE "setting_name" ADD VALUE 'priceEntryMode';--> statement-breakpoint
ALTER TABLE "invoice_extra_instances" RENAME COLUMN "vat_percentage" TO "vat_rate";--> statement-breakpoint
ALTER TABLE "invoice_extra_templates" RENAME COLUMN "vat_percentage" TO "vat_rate";--> statement-breakpoint
ALTER TABLE "invoice_lines" RENAME COLUMN "vat_percentage" TO "vat_rate";--> statement-breakpoint
ALTER TABLE "api_connections" ALTER COLUMN "data" SET NOT NULL;