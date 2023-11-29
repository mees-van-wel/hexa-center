"use client";

import { Translation } from "@/types/translation";
import { ReactNode, createContext, useContext, useState } from "react";

type TranslationContext = {
  translation: Translation;
  setTranslation: (translation: Translation) => any;
} | null;

const TranslationContext = createContext<TranslationContext>(null);

export const TranslationContextProvider = ({
  children,
  initalTranslation,
}: {
  children: ReactNode;
  initalTranslation: Translation;
}) => {
  const [translation, setTranslation] = useState(initalTranslation);

  return (
    <TranslationContext.Provider value={{ translation, setTranslation }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const translationContext = useContext(TranslationContext);

  if (!translationContext)
    throw new Error(
      "useTranslationContext must be used within TranslationContextProvider"
    );

  return translationContext;
};
