CREATE TABLE IF NOT EXISTS "User" (
	"$kind" text DEFAULT 'user' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	"createdById" integer,
	"updatedById" integer,
	"deletedById" integer,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text,
	"phoneNumber" text,
	"street" text,
	"houseNumber" text,
	"postalCode" text,
	"city" text,
	"region" text,
	"country" text,
	"sex" text,
	"dateOfBirth" date,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_updatedById_User_id_fk" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_deletedById_User_id_fk" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
