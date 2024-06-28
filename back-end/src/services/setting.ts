import { eq, inArray } from "drizzle-orm";

import { Settings } from "~/constants/settings";
import { settings } from "~/db/schema";
import { getCtx } from "~/utils/context";

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
) => {
  const { db } = getCtx();

  const settingsResult = await db
    .select()
    .from(settings)
    .where(inArray(settings.name, names));

  const settingsMap = {} as Record<T, Settings[T]>;

  settingsResult.forEach((setting, index) => {
    if (!setting) throw new Error(`Setting '${names[index]}' is missing`);
    settingsMap[setting.name as T] = setting.value as Settings[T];
  });

  return settingsMap;
};
