ALTER TABLE "product_instances" ADD COLUMN "revenue_account_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_templates" ADD COLUMN "revenue_account_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_instances" ADD CONSTRAINT "product_instances_revenue_account_id_ledger_accounts_id_fk" FOREIGN KEY ("revenue_account_id") REFERENCES "ledger_accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_templates" ADD CONSTRAINT "product_templates_revenue_account_id_ledger_accounts_id_fk" FOREIGN KEY ("revenue_account_id") REFERENCES "ledger_accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
