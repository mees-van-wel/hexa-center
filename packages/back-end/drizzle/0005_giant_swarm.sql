ALTER TABLE "Room" ALTER COLUMN "price" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "Room" ADD COLUMN "propertyId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Room" ADD CONSTRAINT "Room_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
