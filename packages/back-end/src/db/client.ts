import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema.js";

let client: PostgresJsDatabase<typeof schema>;

const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) throw new Error("Missing POSTGRES_URL in .env.local");

await migrate(drizzle(postgres(dbUrl, { max: 1 })), {
  migrationsFolder: "drizzle",
});

console.log("Database migrations executed");

if (process.env.NODE_ENV === "production") {
  client = drizzle(postgres(dbUrl), { schema });
} else {
  // @ts-ignore
  if (!global.drizzle) global.drizzle = drizzle(postgres(dbUrl), { schema });
  console.log("Database connection created");
  // @ts-ignore
  client = global.drizzle;
}

export default client;
