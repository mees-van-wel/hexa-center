import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  date,
  integer,
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

export const businesses = pgTable("companies", {
  $kind: text("$kind").default("company").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  name: text("name").unique().notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  addressLineOne: text("address_line_one").notNull(),
  addressLineTwo: text("address_line_two"),
  city: text("city").notNull(),
  region: text("region"),
  postalCode: text("postal_code"),
  country: text("country").notNull(),
  cocNumber: text("coc_number").notNull(),
  vatId: text("vat_id").notNull(),
  iban: text("iban").notNull(),
  swiftBic: text("swift_bic").notNull(),
});

export const businessesRelations = relations(businesses, ({ one }) => ({
  createdBy: one(users, {
    fields: [businesses.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [businesses.updatedById],
    references: [users.id],
  }),
}));

export const roles = pgTable("roles", {
  $kind: text("$kind").default("role").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  name: text("name").unique().notNull(),
});

export const rolesRelations = relations(roles, ({ one }) => ({
  createdBy: one(users, {
    fields: [roles.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [roles.updatedById],
    references: [users.id],
  }),
}));

export const permissions = pgTable(
  "permissions",
  {
    roleId: integer("role_id")
      .references(() => roles.id, { onDelete: "restrict" })
      .notNull(),
    key: text("key").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.key] }),
  }),
);

export const permissionsRelations = relations(permissions, ({ one }) => ({
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
}));

export const users = pgTable("users", {
  $kind: text("$kind").default("user").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  businessId: integer("company_id")
    .references(() => businesses.id, { onDelete: "restrict" })
    .notNull(),
  roleId: integer("role_id")
    .references(() => roles.id, { onDelete: "restrict" })
    .notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  addressLineOne: text("address_line_one"),
  addressLineTwo: text("address_line_two"),
  city: text("city"),
  region: text("region"),
  postalCode: text("postal_code"),
  country: text("country"),
  sex: text("sex"),
  birthDate: date("birth_date", { mode: "date" }),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [users.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [users.updatedById],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [users.businessId],
    references: [businesses.id],
  }),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  accountDetails: one(userAccountDetails),
  sessions: many(userSessions),
}));

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastAccessed: timestamp("last_accessed", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  refreshToken: text("refresh_token").unique().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const userAccountDetails = pgTable("user_account_details", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  locale: text("locale").notNull(),
  theme: text("theme").notNull(),
  color: text("color").notNull(),
  timezone: text("timezone").notNull(),
  dateFormat: text("dateFormat").notNull(),
  decimalSeparator: text("decimalSeparator").notNull(),
  timeFormat: text("timeFormat").notNull(),
  firstDayOfWeek: text("firstDayOfWeek").notNull(),
});

export const userAccountDetailsRelations = relations(
  userAccountDetails,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userAccountDetails.userId],
      references: [users.id],
    }),
    workingHours: many(userAccountDetailsWorkingHours),
  }),
);

export const userAccountDetailsWorkingHours = pgTable(
  "user_account_details_working_hours",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull(),
    accountId: integer("account_id")
      .references(() => userAccountDetails.id, { onDelete: "cascade" })
      .notNull(),
    startDay: integer("start_day").notNull(),
    endDay: integer("end_day").notNull(),
    startTime: time("start_time", { withTimezone: true }).notNull(),
    endTime: time("end_time", { withTimezone: true }).notNull(),
  },
);

export const workingHoursRelations = relations(
  userAccountDetailsWorkingHours,
  ({ one }) => ({
    account: one(userAccountDetails, {
      fields: [userAccountDetailsWorkingHours.accountId],
      references: [userAccountDetails.id],
    }),
  }),
);

export const rooms = pgTable("rooms", {
  $kind: text("$kind").default("room").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  businessId: integer("company_id")
    .references(() => businesses.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").unique().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

export const roomsRelations = relations(rooms, ({ one }) => ({
  createdBy: one(users, {
    fields: [rooms.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [rooms.updatedById],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [rooms.businessId],
    references: [businesses.id],
  }),
}));

export const reservations = pgTable("reservations", {
  $kind: text("$kind").default("reservation").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  customerId: integer("customer_id")
    .references(() => customers.id, { onDelete: "restrict" })
    .notNull(),
  roomId: integer("room_id")
    .references(() => rooms.id, { onDelete: "restrict" })
    .notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  priceOverride: numeric("price_override", { precision: 10, scale: 2 }),
  guestName: text("guest_name"),
  reservationNotes: text("reservation_notes"),
  invoiceNotes: text("invoice_notes"),
});

export const reservationsRelations = relations(
  reservations,
  ({ one, many }) => ({
    createdBy: one(users, {
      fields: [reservations.createdById],
      references: [users.id],
    }),
    updatedBy: one(users, {
      fields: [reservations.updatedById],
      references: [users.id],
    }),
    customer: one(customers, {
      fields: [reservations.customerId],
      references: [customers.id],
    }),
    room: one(rooms, {
      fields: [reservations.roomId],
      references: [rooms.id],
    }),
    invoicesJunction: many(reservationsToInvoices),
    productInstancesJunction: many(reservationsToProductInstances),
  }),
);

// TODO Add support for perInvoice, perPerson, perPersonPerNight, perItem, perDay and perHour
// TODO Add start, Maybe support uponUsage, when invoked show on next invoice only
export const reservationsToProductInstancesCycleEnum = pgEnum(
  "reservations_to_product_instances_cycle",
  ["oneTimeOnNext", "oneTimeOnEnd", "perNightThroughout", "perNightOnEnd"],
);

export const reservationsToProductInstancesStatusEnum = pgEnum(
  "reservations_to_product_instances_status",
  ["notInvoiced", "partiallyInvoiced", "fullyInvoiced"],
);

export const reservationsToProductInstances = pgTable(
  "reservations_to_product_instances",
  {
    reservationId: integer("reservation_id")
      .references(() => reservations.id, { onDelete: "cascade" })
      .notNull(),
    productInstanceId: integer("product_instance_id")
      .references(() => productInstances.id, { onDelete: "cascade" })
      .notNull(),
    quantity: numeric("quantity", { precision: 10, scale: 2 })
      .default("1")
      .notNull(),
    cycle: reservationsToProductInstancesCycleEnum("cycle").notNull(),
    status: reservationsToProductInstancesStatusEnum("status").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reservationId, t.productInstanceId] }),
  }),
);

export const reservationsToProductInstancesRelations = relations(
  reservationsToProductInstances,
  ({ one }) => ({
    reservation: one(reservations, {
      fields: [reservationsToProductInstances.reservationId],
      references: [reservations.id],
    }),
    productInstance: one(productInstances, {
      fields: [reservationsToProductInstances.productInstanceId],
      references: [productInstances.id],
    }),
  }),
);

export const reservationsToInvoices = pgTable(
  "reservations_to_invoices",
  {
    reservationId: integer("reservation_id")
      .notNull()
      .references(() => reservations.id, { onDelete: "cascade" }),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    periodStartDate: timestamp("period_start_date", {
      withTimezone: true,
    }).notNull(),
    periodEndDate: timestamp("period_end_date", {
      withTimezone: true,
    }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reservationId, t.invoiceId] }),
  }),
);

export const reservationsToInvoicesRelations = relations(
  reservationsToInvoices,
  ({ one }) => ({
    reservation: one(reservations, {
      fields: [reservationsToInvoices.reservationId],
      references: [reservations.id],
    }),
    invoice: one(invoices, {
      fields: [reservationsToInvoices.invoiceId],
      references: [invoices.id],
    }),
  }),
);

// TODO Shipping address
export const customers = pgTable("customers", {
  $kind: text("$kind").default("customer").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  businessId: integer("company_id")
    .references(() => businesses.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").unique().notNull(),
  email: text("email"),
  phone: text("phone"),
  billingAddressLineOne: text("billing_address_line_one").notNull(),
  billingAddressLineTwo: text("billing_address_line_two"),
  billingCity: text("billing_city").notNull(),
  billingRegion: text("billing_region"),
  billingPostalCode: text("billing_postal_code"),
  billingCountry: text("billing_country").notNull(),
  cocNumber: text("coc_number"),
  vatId: text("vat_id"),
  contactPersonName: text("contact_person_name"),
  contactPersonEmail: text("contact_person_email"),
  contactPersonPhone: text("contact_person_phone"),
});

export const customersRelations = relations(customers, ({ one }) => ({
  createdBy: one(users, {
    fields: [customers.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [customers.updatedById],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [customers.businessId],
    references: [businesses.id],
  }),
}));

export const invoiceRefTypeEnum = pgEnum("invoice_ref_type", [
  "invoice",
  "reservation",
]);

export const invoiceTypeEnum = pgEnum("invoice_type", [
  "standard",
  "quotation",
  "credit",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "issued",
  "credited",
]);

// TODO Implement payment provider (Adyen) to track payment status
export const invoices = pgTable("invoices", {
  $kind: text("$kind").default("invoice").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  refType: invoiceRefTypeEnum("ref_type").notNull(),
  refId: integer("ref_id").notNull(),
  type: invoiceTypeEnum("type").notNull(),
  status: invoiceStatusEnum("status").notNull(),
  netAmount: numeric("net_amount", { precision: 10, scale: 2 }).notNull(),
  vatAmount: numeric("vat_amount", { precision: 10, scale: 2 }).notNull(),
  grossAmount: numeric("gross_amount", { precision: 10, scale: 2 }).notNull(),
  number: text("number").unique(),
  notes: text("notes"),
  date: date("date", { mode: "date" }),
  dueDate: date("due_date", { mode: "date" }),
  customerId: integer("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  customerName: text("customer_name"),
  customerBusinessContactPerson: text("customer_business_contact_person"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerBillingAddressLineOne: text("customer_billing_address_line_one"),
  customerBillingAddressLineTwo: text("customer_billing_address_line_two"),
  customerBillingCity: text("customer_billing_city"),
  customerBillingRegion: text("customer_billing_region"),
  customerBillingPostalCode: text("customer_billing_postal_code"),
  customerBillingCountry: text("customer_billing_country"),
  customerVatId: text("customer_vat_id"),
  customerCocNumber: text("customer_coc_number"),
  companyId: integer("company_id").references(() => businesses.id, {
    onDelete: "set null",
  }),
  companyName: text("company_name"),
  companyEmail: text("company_email"),
  companyPhone: text("company_phone"),
  companyAddressLineOne: text("company_address_line_one"),
  companyAddressLineTwo: text("company_address_line_two"),
  companyPostalCode: text("company_postal_code"),
  companyCity: text("company_city"),
  companyRegion: text("company_region"),
  companyCountry: text("company_country"),
  companyVatId: text("company_vat_id"),
  companyCocNumber: text("company_coc_number"),
  companyIban: text("company_iban"),
  companySwiftBic: text("company_swift_bic"),
});

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [invoices.createdById],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  company: one(businesses, {
    fields: [invoices.companyId],
    references: [businesses.id],
  }),
  lines: many(invoiceLines),
  events: many(invoiceEvents),
  reservationsJunction: many(reservationsToInvoices),
}));

export const invoiceLines = pgTable("invoice_lines", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  invoiceId: integer("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  revenueAccountId: integer("revenue_account_id")
    .references(() => ledgerAccounts.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").notNull(),
  unitAmount: numeric("unit_amount", { precision: 10, scale: 2 }).notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  netAmount: numeric("net_amount", { precision: 10, scale: 2 }).notNull(),
  vatAmount: numeric("vat_amount", { precision: 10, scale: 2 }).notNull(),
  vatRate: numeric("vat_rate", { precision: 10, scale: 2 }),
  grossAmount: numeric("gross_amount", { precision: 10, scale: 2 }).notNull(),
});

export const invoiceLinesRelations = relations(invoiceLines, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceLines.invoiceId],
    references: [invoices.id],
  }),
  revenueAccount: one(ledgerAccounts, {
    fields: [invoiceLines.revenueAccountId],
    references: [ledgerAccounts.id],
  }),
}));

export const invoiceEventTypeEnum = pgEnum("invoice_event_type", [
  "issued",
  "mailed",
  "credited",
]);

export const invoiceEventRefTypeEnum = pgEnum("invoice_event_ref_type", [
  "invoice",
]);

export const invoiceEvents = pgTable("invoice_events", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  invoiceId: integer("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  type: invoiceEventTypeEnum("type").notNull(),
  refType: invoiceEventRefTypeEnum("ref_type"),
  refId: integer("ref_id"),
});

export const invoiceEventsRelations = relations(invoiceEvents, ({ one }) => ({
  createdBy: one(users, {
    fields: [invoiceEvents.createdById],
    references: [users.id],
  }),
  invoice: one(invoices, {
    fields: [invoiceEvents.invoiceId],
    references: [invoices.id],
  }),
}));

// TODO Inventory
// TODO COGS account
export const productTemplates = pgTable("product_templates", {
  $kind: text("$kind").default("productTemplate").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  revenueAccountId: integer("revenue_account_id")
    .references(() => ledgerAccounts.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  vatRate: numeric("vat_rate", { precision: 10, scale: 2 }),
});

export const productTemplatesRelations = relations(
  productTemplates,
  ({ one, many }) => ({
    createdBy: one(users, {
      fields: [productTemplates.createdById],
      references: [users.id],
    }),
    updatedBy: one(users, {
      fields: [productTemplates.updatedById],
      references: [users.id],
    }),
    revenueAccount: one(ledgerAccounts, {
      fields: [productTemplates.revenueAccountId],
      references: [ledgerAccounts.id],
    }),
    instances: many(productInstances),
  }),
);

export const productInstances = pgTable("product_instances", {
  $kind: text("$kind").default("productInstance").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  templateId: integer("template_id").references(() => productTemplates.id, {
    onDelete: "set null",
  }),
  revenueAccountId: integer("revenue_account_id")
    .references(() => ledgerAccounts.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  vatRate: numeric("vat_rate", { precision: 10, scale: 2 }),
});

export const productInstancesRelations = relations(
  productInstances,
  ({ one, many }) => ({
    template: one(productTemplates, {
      fields: [productInstances.templateId],
      references: [productTemplates.id],
    }),
    revenueAccount: one(ledgerAccounts, {
      fields: [productInstances.revenueAccountId],
      references: [ledgerAccounts.id],
    }),
    reservationsJunction: many(reservationsToProductInstances),
  }),
);

export const journals = pgTable("journals", {
  $kind: text("$kind").default("journal").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  name: text("name").unique().notNull(),
});

export const journalsRelations = relations(journals, ({ one }) => ({
  createdBy: one(users, {
    fields: [journals.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [journals.updatedById],
    references: [users.id],
  }),
}));

export const ledgers = pgTable("ledgers", {
  $kind: text("$kind").default("ledger").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  name: text("name").unique().notNull(),
});

export const ledgersRelations = relations(ledgers, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [ledgers.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [ledgers.updatedById],
    references: [users.id],
  }),
  accounts: many(ledgerAccounts),
}));

export const ledgerAccounts = pgTable("ledger_accounts", {
  $kind: text("$kind").default("ledgerAccount").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  ledgerId: integer("ledger_id")
    .references(() => ledgers.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").unique().notNull(),
});

export const ledgerAccountsRelations = relations(ledgerAccounts, ({ one }) => ({
  createdBy: one(users, {
    fields: [ledgerAccounts.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [ledgerAccounts.updatedById],
    references: [users.id],
  }),
  ledger: one(ledgers, {
    fields: [ledgerAccounts.ledgerId],
    references: [ledgers.id],
  }),
}));

export const settingNameEnum = pgEnum("setting_name", [
  "companyPaymentTerms",
  "companyLogoSrc",
  "invoiceEmailTitle",
  "invoiceEmailContent",
  "invoiceHeaderImageSrc",
  "invoiceFooterImageSrc",
  "priceEntryMode",
  "reservationRevenueAccountId",
]);

export const settings = pgTable("settings", {
  $kind: text("$kind").default("setting").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  updatedById: integer("updated_by_id").references(
    (): AnyPgColumn => users.id,
    { onDelete: "set null" },
  ),
  name: settingNameEnum("name").notNull(),
  value: jsonb("value"),
});

export const settingsRelations = relations(settings, ({ one }) => ({
  updatedBy: one(users, {
    fields: [settings.updatedById],
    references: [users.id],
  }),
}));

export const logTypeEnum = pgEnum("log_type", ["info", "warning", "error"]);

export const logEventEnum = pgEnum("log_event", [
  "integrationConnect",
  "integrationRefreshAuth",
  "integrationSend",
  "integrationSync",
  "integrationDisconnect",
]);

export const logRefTypeEnum = pgEnum("log_ref_type", ["integration"]);

export const logs = pgTable("logs", {
  $kind: text("$kind").default("log").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: integer("user_id").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  type: logTypeEnum("type").notNull(),
  event: logEventEnum("event").notNull(),
  refType: logRefTypeEnum("ref_type"),
  refId: integer("ref_id"),
  data: jsonb("data"),
});

export const logsRelations = relations(logs, ({ one }) => ({
  user: one(users, {
    fields: [logs.userId],
    references: [users.id],
  }),
}));

export const integrationConnectionTypeEnum = pgEnum(
  "integration_connection_type",
  ["twinfield"],
);

export const integrationConnections = pgTable("integration_connections", {
  $kind: text("$kind").default("integrationConnection").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  type: integrationConnectionTypeEnum("type").unique().notNull(),
  data: jsonb("data").notNull(),
});

export const integrationMappingRefTypeEnum = pgEnum(
  "integration_mapping_ref_type",
  ["customer", "ledgerAccount", "journal"],
);

export const integrationMappings = pgTable("integration_mappings", {
  $kind: text("$kind").default("integrationMapping").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  connectionId: integer("connection_id")
    .references(() => integrationConnections.id, { onDelete: "cascade" })
    .notNull(),
  refType: integrationMappingRefTypeEnum("ref_type").notNull(),
  refId: integer("ref_id").notNull(),
  data: jsonb("data").notNull(),
});

export const integrationEntitiesRelations = relations(
  integrationMappings,
  ({ one }) => ({
    connection: one(integrationConnections, {
      fields: [integrationMappings.connectionId],
      references: [integrationConnections.id],
    }),
  }),
);
