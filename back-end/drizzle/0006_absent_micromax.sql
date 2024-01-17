DO $$ BEGIN
 CREATE TYPE "invoiceRefType" AS ENUM('reservation');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoiceStateEnum" AS ENUM('draft', 'issued', 'cancelled', 'refunded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoiceTypeEnum" AS ENUM('standard', 'quotation', 'credit', 'final');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoiceLines" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"invoiceId" integer NOT NULL,
	"name" text NOT NULL,
	"comments" text,
	"unitNetAmount" numeric(10, 2) NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"discountAmount" numeric(10, 2) NOT NULL,
	"totalNetAmount" numeric(10, 2) NOT NULL,
	"totalTaxAmount" numeric(10, 2) NOT NULL,
	"taxPercentage" numeric(10, 2) NOT NULL,
	"totalGrossAmount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"$kind" text DEFAULT 'invoice' NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp with time zone,
	"createdById" integer,
	"updatedById" integer,
	"deletedById" integer,
	"refType" "invoiceRefType" NOT NULL,
	"refId" integer NOT NULL,
	"number" text NOT NULL,
	"comments" text,
	"issueDate" date NOT NULL,
	"dueDate" date NOT NULL,
	"type" "invoiceTypeEnum" NOT NULL,
	"state" "invoiceStateEnum" NOT NULL,
	"discountAmount" numeric(10, 2) NOT NULL,
	"totalNetAmount" numeric(10, 2) NOT NULL,
	"totalTaxAmount" numeric(10, 2) NOT NULL,
	"totalGrossAmount" numeric(10, 2) NOT NULL,
	"totalDiscountAmount" numeric(10, 2) NOT NULL,
	"customerId" integer,
	"customerName" text NOT NULL,
	"customerEmail" text,
	"customerPhoneNumber" text,
	"customerStreet" text NOT NULL,
	"customerHouseNumber" text NOT NULL,
	"customerPostalCode" text NOT NULL,
	"customerCity" text NOT NULL,
	"customerRegion" text NOT NULL,
	"customerCountry" text NOT NULL,
	"customerVatNumber" text,
	"customerCocNumber" text,
	"companyId" integer,
	"companyName" text NOT NULL,
	"companyEmail" text,
	"companyPhoneNumber" text,
	"companyStreet" text NOT NULL,
	"companyHouseNumber" text NOT NULL,
	"companyPostalCode" text NOT NULL,
	"companyCity" text NOT NULL,
	"companyRegion" text NOT NULL,
	"companyCountry" text NOT NULL,
	"companyVatNumber" text NOT NULL,
	"companyCocNumber" text NOT NULL,
	"companyIban" text NOT NULL,
	"companySwiftBic" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Property" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "Role" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoiceLines" ADD CONSTRAINT "invoiceLines_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_updatedById_User_id_fk" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_deletedById_User_id_fk" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_User_id_fk" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_companyId_Property_id_fk" FOREIGN KEY ("companyId") REFERENCES "Property"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
