"use client";

import { AuthProgress } from "@/components/layouts/auth/AuthProgress";
import { AuthTitle } from "@/components/layouts/auth/AuthTitle";
import { EmailInput } from "@/components/pages/login/EmailInput";
import { EmailOtpInput } from "@/components/pages/login/EmailOtpInput";
import { PhoneInput } from "@/components/pages/login/PhoneInput";
import { PhoneOtpInput } from "@/components/pages/login/PhoneOtpInput";
import { useRead } from "@/hooks/useRead";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
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
  // const [data, { loading, error }] = useRead("/test");
  const [step, setStep] = useState<Step>("EMAIL_INPUT");
  const t = useTranslation();

  // if (loading) return <Loader />;

  // if (error) return <p>Error {error.message}</p>;

  // return <p>{data}</p>;

  return (
    <>
      <AuthTitle icon={<IconLogin />}>{t("loginPage.title")}</AuthTitle>
      {step === "EMAIL_INPUT" && (
        <EmailInput
          onCompleted={() => {
            setStep("EMAIL_OTP");
          }}
        />
      )}
      {step === "EMAIL_OTP" && (
        <EmailOtpInput
          onCompleted={() => {
            setStep("PHONE_INPUT");
          }}
        />
      )}
      {step === "PHONE_INPUT" && (
        <PhoneInput
          onCompleted={() => {
            setStep("PHONE_OTP");
          }}
        />
      )}
      {step === "PHONE_OTP" && (
        <PhoneOtpInput
          onCompleted={() => {
            setStep("REMEMBER_ME");
          }}
        />
      )}
      <AuthProgress value={(steps.indexOf(step) / (steps.length - 1)) * 100} />
    </>
  );
}
