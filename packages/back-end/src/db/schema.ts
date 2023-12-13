import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  date,
  integer,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

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
