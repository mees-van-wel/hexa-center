CREATE TABLE IF NOT EXISTS "reservations_to_invoices" (
	"reservation_id" integer NOT NULL,
	"invoice_id" integer NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	CONSTRAINT "reservations_to_invoices_reservation_id_invoice_id_pk" PRIMARY KEY("reservation_id","invoice_id")
);
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
