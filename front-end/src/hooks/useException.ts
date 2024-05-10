import { notifications } from "@mantine/notifications";

import { useTranslation } from "./useTranslation";

export function useException() {
  const t = useTranslation();

  function isJson(str: string) {
    if (!str) return { success: false, json: undefined };

    try {
      return { success: true, json: JSON.parse(str) };
    } catch (e) {
      return { success: false, json: undefined };
    }
  }

  function handleJsonResult(error: any, entity: string) {
    const { success, json } = isJson((error as any).message);

    if (!success) {
      notifications.show({
        message: t("common.oops"),
        color: "red",
      });

      return { success: false };
    }

    const { exception, data } = json;

    if (exception === "DB_UNIQUE_CONSTRAINT") {
      return {
        column: data.column,
        exception: "DB_UNIQUE_CONSTRAINT",
        error: t("exceptions.DB_UNIQUE", entity, data.value, data.column),
      };
    }

    if (exception === "DB_KEY_CONSTRAINT")
      notifications.show({
        message: t("exceptions.DB_STRICT", data.depend, entity),
        color: "red",
      });
  }

  return { isJson, handleJsonResult };
}
