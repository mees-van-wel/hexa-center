DO $$ BEGIN
 CREATE TYPE "integration_mapping_ref_type" AS ENUM('relation');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_mappings" (
	"$kind" text DEFAULT 'integrationMapping' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"connection_id" integer,
	"ref_type" "integration_mapping_ref_type" NOT NULL,
	"ref_id" integer NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
DROP TABLE "integration_entities";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration_mappings" ADD CONSTRAINT "integration_mappings_connection_id_integration_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "integration_connections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
