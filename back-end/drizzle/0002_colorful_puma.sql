ALTER TABLE "reservations" ADD COLUMN "price_override" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "cleaning_fee" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "parking_fee" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "tourist_tax" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN IF EXISTS "guest_name";