import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgres://postgres:root@localhost:5432/hexa-center",
  },
} satisfies Config;
