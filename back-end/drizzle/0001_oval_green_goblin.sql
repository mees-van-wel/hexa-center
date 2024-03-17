DO $$ BEGIN
 CREATE TYPE "integration_mapping_ref_type" AS ENUM('relation', 'ledgerAccount', 'ledgerAccountType');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "setting_name" ADD VALUE 'reservationRevenueAccountId';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_mappings" (
	"$kind" text DEFAULT 'integrationMapping' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"connection_id" integer NOT NULL,
	"ref_type" "integration_mapping_ref_type" NOT NULL,
	"ref_id" integer NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledger_account_types" (
	"$kind" text DEFAULT 'ledgerAccount' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledger_accounts" (
	"$kind" text DEFAULT 'ledgerAccount' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"ledger_id" integer NOT NULL,
	"type_id" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledgers" (
	"$kind" text DEFAULT 'ledger' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"name" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "integration_entities";--> statement-breakpoint
ALTER TABLE "invoice_lines" ADD COLUMN "revenue_account_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_instances" ADD COLUMN "revenue_account_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_templates" ADD COLUMN "revenue_account_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_revenue_account_id_ledger_accounts_id_fk" FOREIGN KEY ("revenue_account_id") REFERENCES "ledger_accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration_mappings" ADD CONSTRAINT "integration_mappings_connection_id_integration_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "integration_connections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger_account_types" ADD CONSTRAINT "ledger_account_types_created_by_id_relations_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger_account_types" ADD CONSTRAINT "ledger_account_types_updated_by_id_relations_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_created_by_id_relations_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_updated_by_id_relations_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_ledger_id_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "ledgers"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_type_id_ledger_account_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "ledger_account_types"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_created_by_id_relations_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_updated_by_id_relations_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
