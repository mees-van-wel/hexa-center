ALTER TYPE "setting_name" ADD VALUE 'companyPaymentTerms';--> statement-breakpoint
ALTER TYPE "setting_name" ADD VALUE 'companyVatNumber';--> statement-breakpoint
ALTER TYPE "setting_name" ADD VALUE 'companyCocNumber';--> statement-breakpoint
ALTER TYPE "setting_name" ADD VALUE 'companyIban';--> statement-breakpoint
ALTER TYPE "setting_name" ADD VALUE 'companySwiftBic';--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "payment_terms";