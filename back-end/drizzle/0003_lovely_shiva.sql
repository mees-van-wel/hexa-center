ALTER TABLE "reservations_to_invoice_extra_instances" DROP CONSTRAINT "reservations_to_invoice_extra_instances_reservation_id_invoice_extra_templates_id_fk";
--> statement-breakpoint
ALTER TABLE "reservations_to_invoice_extra_instances" DROP CONSTRAINT "reservations_to_invoice_extra_instances_instance_id_invoice_extra_templates_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_invoice_extra_instances" ADD CONSTRAINT "reservations_to_invoice_extra_instances_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations_to_invoice_extra_instances" ADD CONSTRAINT "reservations_to_invoice_extra_instances_instance_id_invoice_extra_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "invoice_extra_instances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
