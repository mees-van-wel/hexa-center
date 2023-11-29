import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";
import { TranslationContextProvider } from "@/contexts/TranslationContext";
import { Translation } from "@/types/translation";
import { ReactNode } from "react";

// TODO Implement variable initial locale
export const TranslationInitializer = async ({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) => {
  const translation: Translation = (
    await import(`@/translations/${initialLocale}.ts`)
  ).default;

  return (
    <TranslationContextProvider initalTranslation={translation}>
      {children}
    </TranslationContextProvider>
  );
};
