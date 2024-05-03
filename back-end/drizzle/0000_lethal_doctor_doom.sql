DO $$ BEGIN
 CREATE TYPE "integration_connection_type" AS ENUM('twinfield');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "integration_mapping_ref_type" AS ENUM('customer', 'ledgerAccount', 'journal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_event_ref_type" AS ENUM('invoice');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_event_type" AS ENUM('issued', 'mailed', 'credited');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_ref_type" AS ENUM('invoice', 'reservation');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_status" AS ENUM('draft', 'issued', 'credited');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_type" AS ENUM('standard', 'quotation', 'credit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "log_event" AS ENUM('integrationConnect', 'integrationRefreshAuth', 'integrationSend', 'integrationSync', 'integrationDisconnect');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "log_ref_type" AS ENUM('integration');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "log_type" AS ENUM('info', 'warning', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "reservations_to_product_instances_cycle" AS ENUM('oneTimeOnNext', 'oneTimeOnEnd', 'perNightThroughout', 'perNightOnEnd');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "reservations_to_product_instances_status" AS ENUM('notInvoiced', 'partiallyInvoiced', 'fullyInvoiced');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "setting_name" AS ENUM('companyPaymentTerms', 'companyLogoSrc', 'invoiceEmailTitle', 'invoiceEmailContent', 'invoiceHeaderImageSrc', 'invoiceFooterImageSrc', 'priceEntryMode', 'reservationRevenueAccountId');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"$kind" text DEFAULT 'company' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address_line_one" text NOT NULL,
	"address_line_two" text,
	"city" text NOT NULL,
	"region" text,
	"postal_code" text,
	"country" text NOT NULL,
	"coc_number" text NOT NULL,
	"vat_id" text NOT NULL,
	"iban" text NOT NULL,
	"swift_bic" text NOT NULL,
	CONSTRAINT "companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"$kind" text DEFAULT 'customer' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"company_id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"billing_address_line_one" text NOT NULL,
	"billing_address_line_two" text,
	"billing_city" text NOT NULL,
	"billing_region" text,
	"billing_postal_code" text,
	"billing_country" text NOT NULL,
	"coc_number" text,
	"vat_id" text,
	"contact_person_name" text,
	"contact_person_email" text,
	"contact_person_phone" text,
	CONSTRAINT "customers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_connections" (
	"$kind" text DEFAULT 'integrationConnection' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"type" "integration_connection_type" NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "integration_connections_type_unique" UNIQUE("type")
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "invoice_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"invoice_id" integer NOT NULL,
	"type" "invoice_event_type" NOT NULL,
	"ref_type" "invoice_event_ref_type",
	"ref_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" integer NOT NULL,
	"revenue_account_id" integer NOT NULL,
	"name" text NOT NULL,
	"unit_amount" numeric(10, 2) NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"net_amount" numeric(10, 2) NOT NULL,
	"vat_amount" numeric(10, 2) NOT NULL,
	"vat_rate" numeric(10, 2),
	"gross_amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"$kind" text DEFAULT 'invoice' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"ref_type" "invoice_ref_type" NOT NULL,
	"ref_id" integer NOT NULL,
	"type" "invoice_type" NOT NULL,
	"status" "invoice_status" NOT NULL,
	"net_amount" numeric(10, 2) NOT NULL,
	"vat_amount" numeric(10, 2) NOT NULL,
	"gross_amount" numeric(10, 2) NOT NULL,
	"number" text,
	"notes" text,
	"date" date,
	"due_date" date,
	"customer_id" integer,
	"customer_name" text,
	"customer_business_contact_person" text,
	"customer_email" text,
	"customer_phone" text,
	"customer_billing_address_line_one" text,
	"customer_billing_address_line_two" text,
	"customer_billing_city" text,
	"customer_billing_region" text,
	"customer_billing_postal_code" text,
	"customer_billing_country" text,
	"customer_vat_id" text,
	"customer_coc_number" text,
	"company_id" integer,
	"company_name" text,
	"company_email" text,
	"company_phone" text,
	"company_address_line_one" text,
	"company_address_line_two" text,
	"company_postal_code" text,
	"company_city" text,
	"company_region" text,
	"company_country" text,
	"company_vat_id" text,
	"company_coc_number" text,
	"company_iban" text,
	"company_swift_bic" text,
	CONSTRAINT "invoices_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journals" (
	"$kind" text DEFAULT 'journal' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"name" text NOT NULL,
	CONSTRAINT "journals_name_unique" UNIQUE("name")
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
	"name" text NOT NULL,
	CONSTRAINT "ledger_accounts_name_unique" UNIQUE("name")
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
	"name" text NOT NULL,
	CONSTRAINT "ledgers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logs" (
	"$kind" text DEFAULT 'log' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" integer,
	"type" "log_type" NOT NULL,
	"event" "log_event" NOT NULL,
	"ref_type" "log_ref_type",
	"ref_id" integer,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"role_id" integer NOT NULL,
	"key" text NOT NULL,
	CONSTRAINT "permissions_role_id_key_pk" PRIMARY KEY("role_id","key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_instances" (
	"$kind" text DEFAULT 'productInstance' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"template_id" integer,
	"revenue_account_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"vat_rate" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_templates" (
	"$kind" text DEFAULT 'productTemplate' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"revenue_account_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"vat_rate" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations" (
	"$kind" text DEFAULT 'reservation' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"customer_id" integer NOT NULL,
	"room_id" integer NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"price_override" numeric(10, 2),
	"guest_name" text,
	"reservation_notes" text,
	"invoice_notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations_to_invoices" (
	"reservation_id" integer NOT NULL,
	"invoice_id" integer NOT NULL,
	"period_start_date" timestamp with time zone NOT NULL,
	"period_end_date" timestamp with time zone NOT NULL,
	CONSTRAINT "reservations_to_invoices_reservation_id_invoice_id_pk" PRIMARY KEY("reservation_id","invoice_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations_to_product_instances" (
	"reservation_id" integer NOT NULL,
	"product_instance_id" integer NOT NULL,
	"quantity" numeric(10, 2) DEFAULT '1' NOT NULL,
	"cycle" "reservations_to_product_instances_cycle" NOT NULL,
	"status" "reservations_to_product_instances_status" NOT NULL,
	CONSTRAINT "reservations_to_product_instances_reservation_id_product_instance_id_pk" PRIMARY KEY("reservation_id","product_instance_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"$kind" text DEFAULT 'role' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"name" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"$kind" text DEFAULT 'room' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"company_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	CONSTRAINT "rooms_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"$kind" text DEFAULT 'setting' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"updated_by_id" integer,
	"name" "setting_name" NOT NULL,
	"value" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_account_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"locale" text NOT NULL,
	"theme" text NOT NULL,
	"color" text NOT NULL,
	"timezone" text NOT NULL,
	"dateFormat" text NOT NULL,
	"decimalSeparator" text NOT NULL,
	"timeFormat" text NOT NULL,
	"firstDayOfWeek" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_account_details_working_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"account_id" integer NOT NULL,
	"start_day" integer NOT NULL,
	"end_day" integer NOT NULL,
	"start_time" time with time zone NOT NULL,
	"end_time" time with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_accessed" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"refresh_token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	CONSTRAINT "user_sessions_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"$kind" text DEFAULT 'user' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"company_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"address_line_one" text,
	"address_line_two" text,
	"city" text,
	"region" text,
	"postal_code" text,
	"country" text,
	"sex" text,
	"birth_date" date,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companies" ADD CONSTRAINT "companies_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companies" ADD CONSTRAINT "companies_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE restrict ON UPDATE no action;
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
 ALTER TABLE "invoice_events" ADD CONSTRAINT "invoice_events_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_events" ADD CONSTRAINT "invoice_events_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_revenue_account_id_ledger_accounts_id_fk" FOREIGN KEY ("revenue_account_id") REFERENCES "ledger_accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger_accounts" ADD CONSTRAINT "ledger_accounts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_instances" ADD CONSTRAINT "product_instances_template_id_product_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "product_templates"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "product_templates" ADD CONSTRAINT "product_templates_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_templates" ADD CONSTRAINT "product_templates_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_invoices" ADD CONSTRAINT "reservations_to_invoices_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_invoices" ADD CONSTRAINT "reservations_to_invoices_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_product_instances" ADD CONSTRAINT "reservations_to_product_instances_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_product_instances" ADD CONSTRAINT "reservations_to_product_instances_product_instance_id_product_instances_id_fk" FOREIGN KEY ("product_instance_id") REFERENCES "product_instances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "settings" ADD CONSTRAINT "settings_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_account_details" ADD CONSTRAINT "user_account_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_account_details_working_hours" ADD CONSTRAINT "user_account_details_working_hours_account_id_user_account_details_id_fk" FOREIGN KEY ("account_id") REFERENCES "user_account_details"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;