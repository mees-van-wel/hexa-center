"use client";

import { PhoneInput } from "@/components/common/PhoneInput";
import { AuthProgress } from "@/components/layouts/auth/AuthProgress";
import { AuthTitle } from "@/components/layouts/auth/AuthTitle";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconLogin, IconMailFast } from "@tabler/icons-react";
import { useState } from "react";

const steps = [
  "EMAIL_INPUT",
  "EMAIL_OTP",
  "PHONE_INPUT",
  "PHONE_OTP",
  "REMEMBER_ME",
  "SUCCESS",
] as const;

type Step = (typeof steps)[number];

export default function Login() {
  const [step, setStep] = useState<Step>("EMAIL_INPUT");
  const t = useTranslation();
  const [pn, setpn] = useState("+31655732530");

  return (
    <>
      <AuthTitle icon={<IconLogin />}>{t("loginPage.title")}</AuthTitle>
      <Stack>
        {step === "EMAIL_INPUT" && (
          <>
            <TextInput
              label={t("loginPage.email")}
              type="email"
              withAsterisk
              autoFocus
              autoComplete="username"
            />
            <Button type="submit" leftSection={<IconMailFast />}>
              {t("loginPage.sendEmailCode")}
            </Button>
          </>
        )}
        {step === "EMAIL_OTP" && (
          <>
            <TextInput label={t("loginPage.email")} withAsterisk />
            <Button leftSection={<IconMailFast />}>
              {t("loginPage.sendEmailCode")}
            </Button>
          </>
        )}
        {step === "PHONE_INPUT" && (
          <>
            <PhoneInput
              label={t("loginPage.phoneNumber")}
              withAsterisk
              autoFocus
              autoComplete
              value={pn}
              onChange={(value) => {
                setpn(value);
              }}
            />
            <Button type="submit" leftSection={<IconMailFast />}>
              {t("loginPage.sendEmailCode")}
            </Button>
          </>
        )}
      </Stack>
      <AuthProgress value={(steps.indexOf(step) / (steps.length - 1)) * 100} />
    </>
  );
}
