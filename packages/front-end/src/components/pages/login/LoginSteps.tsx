import { AuthProgress } from "@/components/layouts/auth/AuthProgress";
import { EmailInput } from "./EmailInput";
import { EmailOtpInput } from "./EmailOtpInput";
import { PhoneInput } from "./PhoneInput";
import { PhoneOtpInput } from "./PhoneOtpInput";
import { LOGIN_STEPS, useLoginContext } from "./LoginContext";
import { RememberMe } from "./RememberMe";
import { useTranslation } from "@/hooks/useTranslation";
import { Stack } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

export const LoginSteps = () => {
  const t = useTranslation();
  const {
    loginState: { step },
  } = useLoginContext();

  return (
    <>
      {step === "EMAIL_INPUT" && <EmailInput />}
      {step === "EMAIL_OTP" && <EmailOtpInput />}
      {step === "PHONE_INPUT" && <PhoneInput />}
      {step === "PHONE_OTP" && <PhoneOtpInput />}
      <AuthProgress
        value={(LOGIN_STEPS.indexOf(step) / (LOGIN_STEPS.length - 1)) * 100}
      />
      {step === "REMEMBER_ME" && <RememberMe />}
      {step === "SUCCESS" && (
        <Stack align="center">
          <IconCircleCheck color="#2f9e44" size={48} />
          {/* <Title order={4}>{t("loginPage.loggedInSuccess")}</Title>
          <Loader type="dots" /> */}
        </Stack>
      )}
    </>
  );
};
