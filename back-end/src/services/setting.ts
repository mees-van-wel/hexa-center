import { eq, inArray } from "drizzle-orm";

import { settings } from "@/db/schema";
import { getCtx } from "@/utils/context";
import { Settings } from "@front-end/constants/settings";

// TODO Better error handling
export const getSetting = async <
  T extends (typeof settings.name.enumValues)[number],
>(
  name: T,
) => {
  const { db } = getCtx();

  const settingsResult = await db
    .select()
    .from(settings)
    .where(eq(settings.name, name));

  const setting = settingsResult[0];
  if (!setting) throw new Error(`Setting '${name}' is missing`);

  return setting.value as Settings[T];
};

export const getSettings = async <
  T extends (typeof settings.name.enumValues)[number],
>(
  names: T[],
): Promise<Record<T, Settings[T]>> => {
  const { db } = getCtx();

  const settingsResult = await db
    .select()
    .from(settings)
    .where(inArray(settings.name, names));

  const settingsMap: Record<T, any> = {} as Record<T, any>;

  settingsResult.forEach((setting) => {
    const key = setting.name as T;
    if (key && names.includes(key)) settingsMap[key] = setting.value as any;
  });

  names.forEach((name) => {
    if (!settingsMap[name]) throw new Error(`Setting '${name}' is missing`);
  });

  return settingsMap;
};
