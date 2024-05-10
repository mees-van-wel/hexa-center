import { AsyncLocalStorage } from "async_hooks";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import type * as schema from "~/db/schema";

type Store = {
  db: PostgresJsDatabase<typeof schema>;
  tenant: string;
};

export const ctx = new AsyncLocalStorage<Store>();

export const getCtx = () => {
  const store = ctx.getStore();
  if (!store) throw new Error("Missing ctx store");
  return store;
};
