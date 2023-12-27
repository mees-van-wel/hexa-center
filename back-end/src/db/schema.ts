import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  date,
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const properties = pgTable("Property", {
  $kind: text("$kind").default("property").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
  createdById: integer("createdById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  updatedById: integer("updatedById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  deletedById: integer("deletedById").references((): AnyPgColumn => users.id, {
    onDelete: "cascade",
  }),
  name: text("name").unique().notNull(),
  email: text("email"),
  phoneNumber: text("phoneNumber"),
  street: text("street"),
  houseNumber: text("houseNumber"),
  postalCode: text("postalCode"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
});

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [properties.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [properties.updatedById],
    references: [users.id],
  }),
  deletedBy: one(users, {
    fields: [properties.deletedById],
    references: [users.id],
  }),
  users: many(users),
}));

export const roles = pgTable("Role", {
  $kind: text("$kind").default("role").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
  createdById: integer("createdById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  updatedById: integer("updatedById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  deletedById: integer("deletedById").references((): AnyPgColumn => users.id, {
    onDelete: "cascade",
  }),
  name: text("name").unique().notNull(),
});

export const rolesRelations = relations(roles, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [roles.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [roles.updatedById],
    references: [users.id],
  }),
  deletedBy: one(users, {
    fields: [roles.deletedById],
    references: [users.id],
  }),
  users: many(users),
}));

export const permissions = pgTable(
  "Permission",
  {
    roleId: integer("roleId")
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

export const permissionsRelations = relations(permissions, ({ one }) => ({
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
}));

export const users = pgTable("User", {
  $kind: text("$kind").default("user").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
  createdById: integer("createdById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  updatedById: integer("updatedById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  deletedById: integer("deletedById").references((): AnyPgColumn => users.id, {
    onDelete: "cascade",
  }),
  propertyId: integer("propertyId")
    .references(() => properties.id, { onDelete: "restrict" })
    .notNull(),
  roleId: integer("roleId")
    .references(() => roles.id, { onDelete: "restrict" })
    .notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").unique(),
  phoneNumber: text("phoneNumber").unique(),
  street: text("street"),
  houseNumber: text("houseNumber"),
  postalCode: text("postalCode"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  sex: text("sex"),
  dateOfBirth: date("dateOfBirth"),
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
  deletedBy: one(users, {
    fields: [users.deletedById],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [users.propertyId],
    references: [properties.id],
  }),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  sessions: many(sessions),
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
}));

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
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  refreshToken: text("refresh_token").unique().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accounts = pgTable("Account", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  locale: text("locale").notNull(),
  theme: text("theme").notNull(),
  color: text("color").notNull(),
  timezone: text("timezone").notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  workingHours: many(workingHours),
}));

export const workingHours = pgTable("workingHours", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  accountId: integer("accountId")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  startDay: integer("startDay").notNull(),
  endDay: integer("endDay").notNull(),
  startTime: time("startTime", { withTimezone: true }).notNull(),
  endTime: time("endTime", { withTimezone: true }).notNull(),
});

export const workingHoursRelations = relations(workingHours, ({ one }) => ({
  account: one(accounts, {
    fields: [workingHours.accountId],
    references: [accounts.id],
  }),
}));

export const rooms = pgTable("rooms", {
  $kind: text("$kind").default("room").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
  createdById: integer("createdById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  updatedById: integer("updatedById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  deletedById: integer("deletedById").references((): AnyPgColumn => users.id, {
    onDelete: "cascade",
  }),
  propertyId: integer("propertyId")
    .references(() => properties.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").unique().notNull(),
  price: doublePrecision("price").notNull(),
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
  deletedBy: one(users, {
    fields: [rooms.deletedById],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [rooms.propertyId],
    references: [properties.id],
  }),
}));

export const reservations = pgTable("Reservations", {
  $kind: text("$kind").default("reservation").notNull(),
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp("deletedAt", { withTimezone: true }),
  createdById: integer("createdById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  updatedById: integer("updatedById").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  deletedById: integer("deletedById").references((): AnyPgColumn => users.id, {
    onDelete: "cascade",
  }),
  roomId: integer("roomId")
    .references(() => rooms.id, { onDelete: "cascade" })
    .notNull(),
  customerId: integer("customerId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp("startDate", { withTimezone: true }).notNull(),
  endDate: timestamp("endDate", { withTimezone: true }).notNull(),
  notes: text("notes"),
  guestName: text("guestName"),
});

export const reservationsRelations = relations(reservations, ({ one }) => ({
  createdBy: one(users, {
    fields: [reservations.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [reservations.updatedById],
    references: [users.id],
  }),
  deletedBy: one(users, {
    fields: [reservations.deletedById],
    references: [users.id],
  }),
  customer: one(users, {
    fields: [reservations.customerId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [reservations.roomId],
    references: [rooms.id],
  }),
}));
