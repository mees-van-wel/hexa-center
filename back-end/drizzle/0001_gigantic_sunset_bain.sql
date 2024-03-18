ALTER TYPE "integration_mapping_ref_type" ADD VALUE 'journal';--> statement-breakpoint
ALTER TABLE "ledger_account_types" RENAME TO "journals";--> statement-breakpoint
ALTER TABLE "ledger_accounts" DROP CONSTRAINT IF EXISTS "ledger_accounts_type_id_ledger_account_types_id_fk";
--> statement-breakpoint
ALTER TABLE "journals" DROP CONSTRAINT IF EXISTS "ledger_account_types_created_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "journals" DROP CONSTRAINT IF EXISTS "ledger_account_types_updated_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "journals" ALTER COLUMN "$kind" SET DEFAULT 'journal';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journals" ADD CONSTRAINT "journals_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journals" ADD CONSTRAINT "journals_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ledger_accounts" DROP COLUMN IF EXISTS "type_id";--> statement-breakpoint
ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "journals" ADD CONSTRAINT "journals_name_unique" UNIQUE("name");