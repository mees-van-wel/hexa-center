import { useState } from "react";

import { useCountdown } from "@/hooks/useCountdown";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Group, Input, Loader, PinInput, Stack } from "@mantine/core";
import { IconArrowLeft, IconRefresh } from "@tabler/icons-react";

import { useLoginContext } from "./LoginContext";

export const EmailOtpInput = () => {
  const sendEmailOtp = useMutation("auth", "sendEmailOtp");
  const validateOtp = useMutation("auth", "validateOtp");
  const [error, setError] = useState("");
  const { loginState, setLoginState } = useLoginContext();
  const { count, reset } = useCountdown(60);
  const t = useTranslation();

  const inputHandler = async (value: string) => {
    if (value.length < 4) return;

    const valid = await validateOtp.mutate({
      token: loginState.emailToken,
      otp: value,
    });

    if (!valid && !error) return setError("Invalid code");

    setLoginState({ step: "PHONE_INPUT", emailOtp: value });
  };

  const backHandler = () => {
    setLoginState({ step: "EMAIL_INPUT" });
  };

  const sendAgainHandler = async () => {
    const emailToken = await sendEmailOtp.mutate({ email: loginState.email });
    setLoginState({ emailToken });
    reset();
  };

  return (
    <Stack>
      <Input.Wrapper
        label={t("loginPage.otp")}
        description={`${t("loginPage.emailOtpSent")} ${loginState.email}`}
        error={error}
        withAsterisk
      >
        <Group>
          <PinInput
            type="number"
            disabled={validateOtp.loading}
            onChange={inputHandler}
            oneTimeCode
            aria-required
            aria-invalid={!!error}
            autoFocus
          />
          {validateOtp.loading && <Loader type="dots" />}
        </Group>
      </Input.Wrapper>
      <Group justify="space-between">
        <Button
          onClick={backHandler}
          leftSection={<IconArrowLeft size={16} />}
          variant="light"
          size="xs"
        >
          {t("common.back")}
        </Button>
        <Button
          variant="light"
          size="xs"
          leftSection={<IconRefresh size={16} />}
          disabled={!!count}
          onClick={sendAgainHandler}
          loading={sendEmailOtp.loading}
        >
          {count
            ? `${t("loginPage.sendAgain")} (${count})`
            : t("loginPage.sendAgain")}
        </Button>
      </Group>
    </Stack>
  );
};
