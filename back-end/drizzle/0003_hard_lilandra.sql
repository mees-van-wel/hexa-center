CREATE TABLE IF NOT EXISTS "Permission" (
	"roleId" integer NOT NULL,
	"key" text NOT NULL,
	CONSTRAINT Permission_roleId_key_pk PRIMARY KEY("roleId","key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Property" (
	"$kind" text DEFAULT 'property' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	"createdById" integer,
	"updatedById" integer,
	"deletedById" integer,
	"name" text NOT NULL,
	"email" text,
	"phoneNumber" text,
	"street" text,
	"houseNumber" text,
	"postalCode" text,
	"city" text,
	"region" text,
	"country" text,
	CONSTRAINT "Property_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Role" (
	"$kind" text DEFAULT 'role' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	"createdById" integer,
	"updatedById" integer,
	"deletedById" integer,
	"name" text NOT NULL,
	CONSTRAINT "Role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "propertyId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "roleId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_propertyId_Property_id_fk" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_Property_id_fk" FOREIGN KEY ("roleId") REFERENCES "Property"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Property" ADD CONSTRAINT "Property_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Property" ADD CONSTRAINT "Property_updatedById_User_id_fk" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Property" ADD CONSTRAINT "Property_deletedById_User_id_fk" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Role" ADD CONSTRAINT "Role_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Role" ADD CONSTRAINT "Role_updatedById_User_id_fk" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Role" ADD CONSTRAINT "Role_deletedById_User_id_fk" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
