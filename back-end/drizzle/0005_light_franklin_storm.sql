ALTER TABLE "appointmentTypes" ALTER COLUMN "$kind" SET DEFAULT 'appointmentType';--> statement-breakpoint
ALTER TABLE "appointmentTypes" ALTER COLUMN "appointmentDuration" SET DATA TYPE interval;--> statement-breakpoint
ALTER TABLE "appointmentTypes" ADD CONSTRAINT "appointmentTypes_name_unique" UNIQUE("name");