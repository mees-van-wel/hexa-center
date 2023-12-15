import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema.js";
import { isProduction } from "@hexa-center/shared/utils/environment.js";

let db: PostgresJsDatabase<typeof schema>;

const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) throw new Error("Missing POSTGRES_URL in .env.local");

await migrate(drizzle(postgres(dbUrl, { max: 1 })), {
  migrationsFolder: "drizzle",
});

if (isProduction) db = drizzle(postgres(dbUrl), { schema });
else {
  // @ts-ignore
  if (!global.drizzle) global.drizzle = drizzle(postgres(dbUrl), { schema });

  // @ts-ignore
  db = global.drizzle;
}

export default db;
