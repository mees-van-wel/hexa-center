import { relations as relationBuilder, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
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

export const properties = pgTable("properties", {
  $kind: text("$kind").default("property").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.key] }),
  }),
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
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
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
  roomId: integer("room_id")
    .references(() => rooms.id, { onDelete: "restrict" })
    .notNull(),
  customerId: integer("customer_id")
    .references(() => relations.id, { onDelete: "restrict" })
    .notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  priceOverride: numeric("price_override", {
    precision: 10,
    scale: 2,
  }),
  notes: text("notes"),
});

export const reservationsRelations = relationBuilder(
  reservations,
  ({ one, many }) => ({
    createdBy: one(relations, {
      fields: [reservations.createdById],
      references: [relations.id],
    }),
    updatedBy: one(relations, {
      fields: [reservations.updatedById],
      references: [relations.id],
    }),
    customer: one(relations, {
      fields: [reservations.customerId],
      references: [relations.id],
    }),
    room: one(rooms, {
      fields: [reservations.roomId],
      references: [rooms.id],
    }),
    // reservationsToReservationCharges: many(reservationsToReservationCharges),
    reservationsToInvoices: many(reservationsToInvoices),
  }),
);

export const priceAdjustmentTypeEnum = pgEnum("price_adjustment_type", [
  "reservation",
]);

export const reservationPriceAdjustmentUnitEnum = pgEnum(
  "reservation_price_adjustment_unit",
  ["currency", "percentage"],
);

// TODO Maybe support uponUsage, when invoked show on next invoice only
export const reservationPriceAdjustmentTimingEnum = pgEnum(
  "reservation_price_adjustment_interval",
  ["start", "end", "throughoutSpread", "throughoutRepeat"],
);

// TODO Add support for perInvoice, perPerson, perPersonPerNight, perItem, perDay and perHour
export const reservationPriceAdjustmentBasisEnum = pgEnum(
  "reservation_price_adjustment_interval",
  ["oneTime", "perNight"],
);

// TODO Maybe other name like "fixed invoice lines" because that's what it is
export const priceAdjustments = pgTable("price_adjustments", {
  $kind: text("$kind").default("priceAdjustment").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
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
  type: priceAdjustmentTypeEnum("type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  amount: numeric("amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  unit: reservationPriceAdjustmentUnitEnum("unit").notNull(),
  timing: reservationPriceAdjustmentTimingEnum("timing").notNull(),
  basis: reservationPriceAdjustmentBasisEnum("basis").notNull(),
  taxPercentage: numeric("tax_percentage", {
    precision: 10,
    scale: 2,
  })
    .default("0")
    .notNull(),
  autoAdd: boolean("auto_add").default(false).notNull(),
});

export const priceAdjustmentsRelations = relationBuilder(
  priceAdjustments,
  ({ one }) => ({
    createdBy: one(relations, {
      fields: [priceAdjustments.createdById],
      references: [relations.id],
    }),
    updatedBy: one(relations, {
      fields: [priceAdjustments.updatedById],
      references: [relations.id],
    }),
  }),
);

// export const reservationsToReservationCharges = pgTable(
//   "reservations_to_reservation_charges",
//   {
//     reservationId: integer("reservation_id")
//       .notNull()
//       .references(() => reservations.id, { onDelete: "cascade" }),
//     reservationChargeId: integer("reservation_charge_id")
//       .notNull()
//       .references(() => reservationCharges.id, { onDelete: "cascade" }),
//     nameOverride: text("name_override"),
//     priceOverride: numeric("price_override", {
//       precision: 10,
//       scale: 2,
//     }),
//     taxPercentageOveride: numeric("tax_percentage_override", {
//       precision: 10,
//       scale: 2,
//     }),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.reservationId, t.reservationChargeId] }),
//   }),
// );

// export const reservationsToReservationChargesRelations = relationBuilder(
//   reservationsToReservationCharges,
//   ({ one }) => ({
//     reservation: one(reservations, {
//       fields: [reservationsToReservationCharges.reservationId],
//       references: [reservations.id],
//     }),
//     invoice: one(reservationCharges, {
//       fields: [reservationsToReservationCharges.reservationChargeId],
//       references: [reservationCharges.id],
//     }),
//   }),
// );

export const invoiceRefTypeEnum = pgEnum("invoice_ref_type", [
  "invoice",
  "reservation",
]);

export const invoiceTypeEnum = pgEnum("invoice_type", [
  "standard",
  "quotation",
  "credit",
  "final",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "issued",
  "credited",
]);

// TODO Implement payment provider (Adyen) to track payment status
// TODO Make all curreny columns not null (e.g. discount) populate with .default("0")
export const invoices = pgTable("invoices", {
  $kind: text("$kind").default("invoice").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdById: integer("created_by_id").references(
    (): AnyPgColumn => relations.id,
    { onDelete: "set null" },
  ),
  refType: invoiceRefTypeEnum("ref_type").notNull(),
  refId: integer("ref_id").notNull(),
  type: invoiceTypeEnum("type").notNull(),
  status: invoiceStatusEnum("status").notNull(),
  discountAmount: numeric("discount_amount", {
    precision: 10,
    scale: 2,
  }),
  totalNetAmount: numeric("total_net_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalDiscountAmount: numeric("total_discount_amount", {
    precision: 10,
    scale: 2,
  }),
  totalTaxAmount: numeric("total_tax_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalGrossAmount: numeric("total_gross_amount", {
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
  customer: one(relations, {
    fields: [invoices.customerId],
    references: [relations.id],
  }),
  company: one(properties, {
    fields: [invoices.companyId],
    references: [properties.id],
  }),
  lines: many(invoiceLines),
  events: many(invoiceEvents),
  reservationsToInvoices: many(reservationsToInvoices),
}));

export const invoiceLines = pgTable("invoice_lines", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
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
  totalNetAmount: numeric("total_net_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  discountAmount: numeric("discount_amount", {
    precision: 10,
    scale: 2,
  }),
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
    (): AnyPgColumn => relations.id,
    { onDelete: "set null" },
  ),
  invoiceId: integer("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  type: invoiceEventTypeEnum("type").notNull(),
  refType: invoiceEventRefTypeEnum("ref_type"),
  refId: integer("ref_id"),
});

export const invoiceEventsRelations = relationBuilder(
  invoiceEvents,
  ({ one }) => ({
    createdBy: one(relations, {
      fields: [invoiceEvents.createdById],
      references: [relations.id],
    }),
    invoice: one(invoices, {
      fields: [invoiceEvents.invoiceId],
      references: [invoices.id],
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
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reservationId, t.invoiceId] }),
  }),
);

export const reservationsToInvoicesRelations = relationBuilder(
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

export const settingNameEnum = pgEnum("setting_name", [
  "companyPaymentTerms",
  "companyVatNumber",
  "companyCocNumber",
  "companyIban",
  "companySwiftBic",
  "invoiceEmailTitle",
  "invoiceEmailContent",
  "invoiceHeaderImageSrc",
  "invoiceFooterImageSrc",
]);

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull(),
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
