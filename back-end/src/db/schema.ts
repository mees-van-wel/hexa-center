import { relations as relationBuilder, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  date,
  doublePrecision,
  integer,
  interval,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  $kind: text("$kind").default("property").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  name: text("name").unique().notNull(),
  emailAddress: text("email_address"),
  phoneNumber: text("phone_number"),
  street: text("street"),
  houseNumber: text("house_number"),
  postalCode: text("postal_code"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
});

export const propertiesRelations = relationBuilder(properties, ({ one }) => ({
  createdBy: one(relations, {
    fields: [properties.createdById],
    references: [relations.id],
  }),
  updatedBy: one(relations, {
    fields: [properties.updatedById],
    references: [relations.id],
  }),
}));

export const roles = pgTable("roles", {
  $kind: text("$kind").default("role").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  name: text("name").unique().notNull(),
});

export const rolesRelations = relationBuilder(roles, ({ one }) => ({
  createdBy: one(relations, {
    fields: [roles.createdById],
    references: [relations.id],
  }),
  updatedBy: one(relations, {
    fields: [roles.updatedById],
    references: [relations.id],
  }),
}));

export const permissions = pgTable(
  "permissions",
  {
    roleId: integer("role_id")
      .references(() => properties.id, { onDelete: "restrict" })
      .notNull(),
    key: text("key").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roleId, table.key] }),
    };
  },
);

export const permissionsRelations = relationBuilder(permissions, ({ one }) => ({
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
}));

export const relationTypeEnum = pgEnum("relation_type", [
  "individual",
  "business",
]);

export const relations = pgTable("relations", {
  $kind: text("$kind").default("relation").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  propertyId: integer("property_id")
    .references(() => properties.id, { onDelete: "restrict" })
    .notNull(),
  roleId: integer("role_id")
    .references(() => roles.id, { onDelete: "restrict" })
    .notNull(),
  type: relationTypeEnum("type").notNull(),
  name: text("name").notNull(),
  emailAddress: text("email_address").unique(),
  phoneNumber: text("phone_number").unique(),
  street: text("street"),
  houseNumber: text("house_number"),
  postalCode: text("postal_code"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  sex: text("sex"),
  dateOfBirth: date("date_of_birth", { mode: "date" }),
  vatNumber: text("vat_number"),
  cocNumber: text("coc_number"),
  businessContactName: text("business_contact_name"),
  businessContactEmailAddress: text("business_contact_email_address"),
  businessContactPhoneNumber: text("business_contact_phone_number"),
});

export const relationsRelations = relationBuilder(
  relations,
  ({ one, many }) => ({
    createdBy: one(relations, {
      fields: [relations.createdById],
      references: [relations.id],
    }),
    updatedBy: one(relations, {
      fields: [relations.updatedById],
      references: [relations.id],
    }),
    property: one(properties, {
      fields: [relations.propertyId],
      references: [properties.id],
    }),
    role: one(roles, {
      fields: [relations.roleId],
      references: [roles.id],
    }),
    sessions: many(sessions),
    account: one(accounts, {
      fields: [relations.id],
      references: [accounts.relationId],
    }),
  }),
);

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  issuedAt: timestamp("issued_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastAccessed: timestamp("last_accessed", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  relationId: integer("relation_id")
    .references(() => relations.id, { onDelete: "cascade" })
    .notNull(),
  refreshToken: text("refresh_token").unique().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const sessionsRelations = relationBuilder(sessions, ({ one }) => ({
  relation: one(relations, {
    fields: [sessions.relationId],
    references: [relations.id],
  }),
}));

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  relationId: integer("relation_id")
    .references(() => relations.id, { onDelete: "cascade" })
    .notNull(),
  locale: text("locale").notNull(),
  theme: text("theme").notNull(),
  color: text("color").notNull(),
  timezone: text("timezone").notNull(),
});

export const accountsRelations = relationBuilder(accounts, ({ many }) => ({
  workingHours: many(workingHours),
}));

export const workingHours = pgTable("working_hours", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  accountId: integer("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  startDay: integer("start_day").notNull(),
  endDay: integer("end_day").notNull(),
  startTime: time("start_time", { withTimezone: true }).notNull(),
  endTime: time("end_time", { withTimezone: true }).notNull(),
});

export const workingHoursRelations = relationBuilder(
  workingHours,
  ({ one }) => ({
    account: one(accounts, {
      fields: [workingHours.accountId],
      references: [accounts.id],
    }),
  }),
);

export const rooms = pgTable("rooms", {
  $kind: text("$kind").default("room").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  propertyId: integer("property_id")
    .references(() => properties.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").unique().notNull(),
  price: doublePrecision("price").notNull(),
});

export const roomsRelations = relationBuilder(rooms, ({ one }) => ({
  createdBy: one(relations, {
    fields: [rooms.createdById],
    references: [relations.id],
  }),
  updatedBy: one(relations, {
    fields: [rooms.updatedById],
    references: [relations.id],
  }),
  property: one(properties, {
    fields: [rooms.propertyId],
    references: [properties.id],
  }),
}));

export const invoiceRefTypeEnum = pgEnum("invoice_ref_type", ["reservation"]);

export const invoiceTypeEnum = pgEnum("invoice_type", [
  "standard",
  "quotation",
  "credit",
  "final",
]);

// TODO Implement payment provider (Adyen) to track payment status
export const invoices = pgTable("invoices", {
  $kind: text("$kind").default("invoice").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => relations.id,
    {
      onDelete: "set null",
    },
  ),
  refType: invoiceRefTypeEnum("ref_type").notNull(),
  refId: integer("ref_id").notNull(),
  type: invoiceTypeEnum("type").notNull(),
  paymentTerms: interval("payment_terms").notNull(),
  discountAmount: numeric("discount_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalNetAmount: numeric("total_net_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalTaxAmount: numeric("total_tax_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalGrossAmount: numeric("total_gross_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalDiscountAmount: numeric("total_discount_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  number: text("number"),
  comments: text("comments"),
  date: date("date", { mode: "date" }),
  dueDate: date("due_date", { mode: "date" }),
  customerId: integer("customer_id").references(() => relations.id, {
    onDelete: "set null",
  }),
  customerName: text("customer_name"),
  customerEmailAddress: text("customer_email_address"),
  customerPhoneNumber: text("customer_phone_number"),
  customerStreet: text("customer_street"),
  customerHouseNumber: text("customer_house_number"),
  customerPostalCode: text("customer_postal_code"),
  customerCity: text("customer_city"),
  customerRegion: text("customer_region"),
  customerCountry: text("customer_country"),
  customerVatNumber: text("customer_vat_number"),
  customerCocNumber: text("customer_coc_number"),
  companyId: integer("company_id").references(() => properties.id, {
    onDelete: "set null",
  }),
  companyName: text("company_name"),
  companyEmailAddress: text("company_email_address"),
  companyPhoneNumber: text("company_phone_number"),
  companyStreet: text("company_street"),
  companyHouseNumber: text("company_house_number"),
  companyPostalCode: text("company_postal_code"),
  companyCity: text("company_city"),
  companyRegion: text("company_region"),
  companyCountry: text("company_country"),
  companyVatNumber: text("company_vat_number"),
  companyCocNumber: text("company_coc_number"),
  companyIban: text("company_iban"),
  companySwiftBic: text("company_swift_bic"),
});

export const invoicesRelations = relationBuilder(invoices, ({ one, many }) => ({
  createdBy: one(relations, {
    fields: [invoices.createdById],
    references: [relations.id],
  }),
  updatedBy: one(relations, {
    fields: [invoices.updatedById],
    references: [relations.id],
  }),
  customer: one(relations, {
    fields: [invoices.customerId],
    references: [relations.id],
  }),
  company: one(properties, {
    fields: [invoices.companyId],
    references: [properties.id],
  }),
  lines: many(invoiceLines),
  logs: many(invoiceLogs),
}));

export const invoiceLines = pgTable("invoice_lines", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  invoiceId: integer("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  comments: text("comments"),
  unitNetAmount: numeric("unit_net_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalNetAmount: numeric("total_net_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalTaxAmount: numeric("total_tax_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  taxPercentage: numeric("tax_percentage", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalGrossAmount: numeric("total_gross_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const invoiceLinesRelations = relationBuilder(
  invoiceLines,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceLines.invoiceId],
      references: [invoices.id],
    }),
  }),
);

export const invoiceLogTypeEnum = pgEnum("invoice_log_type", [
  "issued",
  "mailed",
  "credited",
]);

export const invoiceLogRefTypeEnum = pgEnum("invoice_log_ref_type", [
  "invoice",
]);

export const invoiceLogs = pgTable("invoice_logs", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => relations.id,
    { onDelete: "set null" },
  ),
  invoiceId: integer("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  type: invoiceLogTypeEnum("type").notNull(),
  refType: invoiceLogRefTypeEnum("ref_type"),
  refId: integer("ref_id"),
});

export const invoiceLogsRelations = relationBuilder(invoiceLogs, ({ one }) => ({
  createdBy: one(relations, {
    fields: [invoiceLogs.createdById],
    references: [relations.id],
  }),
  invoice: one(invoices, {
    fields: [invoiceLogs.invoiceId],
    references: [invoices.id],
  }),
}));

export const settingNameEnum = pgEnum("setting_name", [
  "invoiceEmailTitle",
  "invoiceEmailContent",
]);

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => relations.id,
    { onDelete: "set null" },
  ),
  name: settingNameEnum("name").notNull(),
  value: jsonb("value"),
});

export const settingRelations = relationBuilder(settings, ({ one }) => ({
  updatedAt: one(relations, {
    fields: [settings.updatedAt],
    references: [relations.id],
  }),
}));
