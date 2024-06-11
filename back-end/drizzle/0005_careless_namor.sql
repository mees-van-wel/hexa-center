DO $$ BEGIN
 CREATE TYPE "public"."form_item_type" AS ENUM('info', 'link', 'textSmall', 'textLarge', 'textEditor', 'number', 'date', 'checkbox', 'multipleChoice', 'singleChoice', 'multipleDropdown', 'singleDropdown');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."form_ref_type" AS ENUM('setting', 'customer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "setting_name" ADD VALUE 'defaultCustomerCustomFields';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_items" (
	"$kind" text DEFAULT 'formItem' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"item_id" integer NOT NULL,
	"type" "form_item_type" NOT NULL,
	"optional" boolean NOT NULL,
	"position" integer NOT NULL,
	"name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_options" (
	"$kind" text DEFAULT 'formOption' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"item_id" integer NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_sections" (
	"$kind" text DEFAULT 'formSection' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"form_id" integer NOT NULL,
	"position" integer NOT NULL,
	"title" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_values" (
	"$kind" text DEFAULT 'formOption' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"item_id" integer NOT NULL,
	"value" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "forms" (
	"$kind" text DEFAULT 'form' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"ref_type" "form_ref_type" NOT NULL,
	"ref_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_items" ADD CONSTRAINT "form_items_item_id_form_sections_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."form_sections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_options" ADD CONSTRAINT "form_options_item_id_form_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."form_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_sections" ADD CONSTRAINT "form_sections_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_values" ADD CONSTRAINT "form_values_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_values" ADD CONSTRAINT "form_values_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_values" ADD CONSTRAINT "form_values_item_id_form_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."form_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
