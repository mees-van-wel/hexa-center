import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "./db/schema";

declare global {
  namespace Express {
    interface Request {
      db: PostgresJsDatabase<typeof schema>;
    }
  }
}
