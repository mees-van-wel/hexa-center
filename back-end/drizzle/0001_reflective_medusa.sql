CREATE TABLE IF NOT EXISTS "Account" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"userId" integer NOT NULL,
	"locale" text NOT NULL,
	"theme" text NOT NULL,
	"color" text NOT NULL,
	"timezone" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workingHours" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"accountId" integer NOT NULL,
	"startDay" integer NOT NULL,
	"endDay" integer NOT NULL,
	"startTime" time with time zone NOT NULL,
	"endTime" time with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workingHours" ADD CONSTRAINT "workingHours_accountId_Account_id_fk" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
