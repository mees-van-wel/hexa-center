ALTER TABLE "Room" RENAME TO "rooms";--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "Room_name_unique";--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "Room_createdById_User_id_fk";
--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "Room_updatedById_User_id_fk";
--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "Room_deletedById_User_id_fk";
--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "price" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "propertyId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_updatedById_User_id_fk" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_deletedById_User_id_fk" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_name_unique" UNIQUE("name");