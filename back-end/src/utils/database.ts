import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import NodeCache from "node-cache";
import postgres from "postgres";

import * as schema from "../db/schema";

const drizzleClientCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 900,
  useClones: false,
});

const createDynamicConnection = async (databaseName: string) => {
  let dbUrl = process.env.POSTGRES_URL;
  if (!dbUrl) {
    console.warn("Missing env POSTGRES_URL");
    throw new Error("Missing env POSTGRES_URL");
  }

  const parts = dbUrl.split("/");
  parts[parts.length - 1] = databaseName;
  dbUrl = parts.join("/");

  // TODO put as deployment step
  await migrate(drizzle(postgres(dbUrl, { ssl: "require", max: 1 })), {
    migrationsFolder: "drizzle",
  });

  return drizzle(postgres(dbUrl, { ssl: "require" }), { schema });
};

export const getDatabaseClient = async (tenantName: string) => {
  let client: PostgresJsDatabase<typeof schema> | undefined =
    drizzleClientCache.get(tenantName);

  if (!client) {
    console.log(
      `Database connection for "${tenantName}" not found, creating new one`,
    );
    client = await createDynamicConnection(tenantName);
    drizzleClientCache.set(tenantName, client);
  }

  return client;
};
