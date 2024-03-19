ALTER TABLE "properties" RENAME TO "businesses";--> statement-breakpoint
ALTER TABLE "customers" RENAME COLUMN "property_id" TO "business_id";--> statement-breakpoint
ALTER TABLE "rooms" RENAME COLUMN "property_id" TO "business_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "property_id" TO "business_id";--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT IF EXISTS "properties_name_unique";--> statement-breakpoint
ALTER TABLE "customers" DROP CONSTRAINT IF EXISTS "customers_property_id_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "invoices_company_id_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "permissions" DROP CONSTRAINT IF EXISTS "permissions_role_id_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "rooms_property_id_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_property_id_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT IF EXISTS "properties_created_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT IF EXISTS "properties_updated_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "$kind" SET DEFAULT 'business';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_businesses_id_fk" FOREIGN KEY ("company_id") REFERENCES "businesses"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_businesses_id_fk" FOREIGN KEY ("role_id") REFERENCES "businesses"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_name_unique" UNIQUE("name");