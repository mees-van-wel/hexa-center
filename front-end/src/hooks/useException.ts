import { useFormContext } from "react-hook-form";

import { notifications } from "@mantine/notifications";

import { useTranslation } from "./useTranslation";

export function useException() {
  const t = useTranslation();
  const { reset, setError } = useFormContext();

  function isJson(str: string) {
    if (!str) return { success: false, json: undefined };

    try {
      return { success: true, json: JSON.parse(str) };
    } catch (e) {
      return { success: false, json: undefined };
    }
  }

  function handleJsonResult(
    error: any,
    entity: string,
    // value: string,
    // column: string,
  ) {
    const { success, json } = isJson((error as any).message);

    if (!success) {
      notifications.show({
        message: t("common.oops"),
        color: "red",
      });

      reset();

      return { success: false, exception: undefined, data: undefined };
    }

    const { exception, data } = json;

    if (exception === "DB_UNIQUE_CONSTRAINT") {
      setError(data.column, {
        message: `${
          data.column.charAt(0).toUpperCase() + data.column.slice(1)
        } ${t("exceptions.DB_UNIQUE")} ${entity.toLowerCase()}`,
      });
    }

    // if (exception === "DB_KEY_CONSTRAINT")
    //   notifications.show({
    //     message: t("exceptions.DB_KEY_CONSTRAINT", {
    //       depend: data.depend,
    //       entity: t("entities.user.singularName"),
    //     }),
    //     color: "red",
    //   });

    // return { success: true, exception, data };
  }

  return { isJson, handleJsonResult };
}
