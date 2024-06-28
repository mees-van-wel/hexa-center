import { Button, Group, Input, Loader, PinInput, Stack } from "@mantine/core";
import { IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";

import { useCountdown } from "@/hooks/useCountdown";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";

import { useLoginContext } from "./LoginContext";

export const PhoneOtpInput = () => {
  const sendPhoneOtp = useMutation("auth", "sendPhoneOtp");
  const validateOtp = useMutation("auth", "validateOtp");
  const [error, setError] = useState("");
  const { loginState, setLoginState } = useLoginContext();
  const { count, reset } = useCountdown(60);
  const t = useTranslation();

  const inputHandler = async (value: string) => {
    if (value.length < 4) return;

    const valid = await validateOtp.mutate({
      token: loginState.phoneToken,
      otp: value,
    });

    if (!valid && !error) return setError("Invalid code");

    setLoginState({ step: "REMEMBER_ME", phoneOtp: value });
  };

  const backHandler = () => {
    setLoginState({ step: "PHONE_INPUT" });
  };

  const sendAgainHandler = async () => {
    const phoneToken = await sendPhoneOtp.mutate({
      phone: loginState.phone,
    });
    setLoginState({ phoneToken });
    reset();
  };

  return (
    <Stack>
      <Input.Wrapper
        label={t("loginPage.otp")}
        description={`${t("loginPage.phoneOtpSent")} ${loginState.phone}`}
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
          loading={sendPhoneOtp.loading}
        >
          {count
            ? `${t("loginPage.sendAgain")} (${count})`
            : t("loginPage.sendAgain")}
        </Button>
      </Group>
    </Stack>
  );
};
