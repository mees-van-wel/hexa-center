"use client";

import { IconLogin } from "@tabler/icons-react";

import { AuthTitle } from "@/components/layouts/auth/AuthTitle";
import { LoginContextProvider } from "@/components/pages/login/LoginContext";
import { LoginSteps } from "@/components/pages/login/LoginSteps";
import { useTranslation } from "@/hooks/useTranslation";

export default function Page() {
  const t = useTranslation();

  return (
    <>
      <AuthTitle icon={<IconLogin />}>{t("loginPage.login")}</AuthTitle>
      <LoginContextProvider>
        <LoginSteps />
      </LoginContextProvider>
    </>
  );
}
