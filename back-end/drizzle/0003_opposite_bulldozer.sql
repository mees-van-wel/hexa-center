DO $$ BEGIN
 CREATE TYPE "reservation_charge_interval" AS ENUM('oneTimeStart', 'oneTimeEnd', 'perNight');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservation_charges" (
	"$kind" text DEFAULT 'reservationCharge' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_id" integer,
	"updated_by_id" integer,
	"auto_add" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"tax_percentage" numeric(10, 2) DEFAULT '0' NOT NULL,
	"interval" "reservation_charge_interval"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations_to_reservation_charges" (
	"reservation_id" integer NOT NULL,
	"reservation_charge_id" integer NOT NULL,
	"name_override" text,
	"price_override" numeric(10, 2),
	"tax_percentage_override" numeric(10, 2),
	CONSTRAINT "reservations_to_reservation_charges_reservation_id_reservation_charge_id_pk" PRIMARY KEY("reservation_id","reservation_charge_id")
);
--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN IF EXISTS "cleaning_fee";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN IF EXISTS "parking_fee";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN IF EXISTS "tourist_tax";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservation_charges" ADD CONSTRAINT "reservation_charges_created_by_id_relations_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservation_charges" ADD CONSTRAINT "reservation_charges_updated_by_id_relations_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "relations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_reservation_charges" ADD CONSTRAINT "reservations_to_reservation_charges_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_reservation_charges" ADD CONSTRAINT "reservations_to_reservation_charges_reservation_charge_id_reservation_charges_id_fk" FOREIGN KEY ("reservation_charge_id") REFERENCES "reservation_charges"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
