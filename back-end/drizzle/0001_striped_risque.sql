ALTER TABLE "accounts" ADD COLUMN "dateFormat" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "decimalSeparator" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "timeFormat" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "firstDayOfWeek" text NOT NULL;