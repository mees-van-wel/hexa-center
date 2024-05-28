"use client";

import { useCallback } from "react";

import { useTranslationContext } from "@/contexts/TranslationContext";
import type { TranslationPaths } from "@/types/translation";

type Translator = <P extends keyof TranslationPaths>(
  key: P,
  ...params: TranslationPaths[P] extends undefined
    ? []
    : [Exclude<TranslationPaths[P], undefined>]
) => string;

export const useTranslation = () => {
  const { translation } = useTranslationContext();

  return useCallback(
    (key, ...params) => {
      const value = key
        .split(".")
        .reduce<
          Record<string, any>
        >((o, x) => (o === undefined ? undefined : o[x]), translation);

      return value
        ? typeof value === "string"
          ? value
          : // @ts-ignore TODO Fix typings
            value(params)
        : key;
    },
    [translation],
  ) as Translator;
};
