import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: "postgres://postgres:root@localhost:5432/hexa-center",
  },
  verbose: true,
  strict: true,
});
