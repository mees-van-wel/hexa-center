import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "@/hooks/useTranslation";
import { useWrite } from "@/hooks/useWrite";
import { Button, Group, Input, Loader, PinInput, Stack } from "@mantine/core";
import { IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { useLoginContext } from "./LoginContext";
import { useState } from "react";

export const EmailOtpInput = () => {
  const sendEmailOtp = useWrite("POST", "/send-email-otp");
  const validateOtp = useWrite("POST", "/validate-otp");
  const [error, setError] = useState("");
  const { loginState, setLoginState } = useLoginContext();
  const { count, reset } = useCountdown(60);
  const t = useTranslation();

  const inputHandler = async (value: string) => {
    if (value.length < 4) return;

    try {
      const result = await validateOtp.execute({
        token: loginState.emailToken,
        otp: value,
      });

      if (!result.valid) return setError("Invalid code");
      if (error) setError("");
      setLoginState({ step: "PHONE_INPUT", emailOtp: value });
    } catch (error) {
      // TODO Error handling
      console.log("CATCHED", error);
    }
  };

  const backHandler = () => {
    setLoginState({ step: "EMAIL_INPUT" });
  };

  const sendAgainHandler = async () => {
    await sendEmailOtp.execute({ email: loginState.email });
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
