import { sql } from "drizzle-orm";
import {
  AnyPgColumn,
  date,
  integer,
  pgTable,
  serial,
  text,
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
