ALTER TABLE "invoices" RENAME COLUMN "comments" TO "notes";--> statement-breakpoint
ALTER TABLE "invoice_lines" DROP COLUMN IF EXISTS "comments";