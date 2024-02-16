ALTER TYPE "invoice_ref_type" ADD VALUE 'invoice';--> statement-breakpoint
ALTER TABLE "invoice_lines" ALTER COLUMN "discount_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "discount_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "total_discount_amount" DROP NOT NULL;