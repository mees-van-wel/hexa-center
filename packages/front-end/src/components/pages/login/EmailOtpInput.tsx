import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "@/hooks/useTranslation";
import { useWrite } from "@/hooks/useWrite";
import { Button, Group, Input, Loader, PinInput, Stack } from "@mantine/core";
import { IconArrowLeft, IconRefresh } from "@tabler/icons-react";

type EmailOtpProps = {
  onCompleted: () => any;
};

// TODO login context to store shared values and loading overlay state
export const EmailOtpInput = ({ onCompleted }: EmailOtpProps) => {
  const sendEmailOtp = useWrite("POST", "/send-email-otp");
  const validateOtp = useWrite("POST", "/validate-otp");
  const { count, reset } = useCountdown(60);
  const t = useTranslation();

  const inputHandler = async (value: string) => {
    const result = await validateOtp.execute();
    onCompleted();
  };

  const sendAgainHandler = async () => {
    await sendEmailOtp.execute();
    reset();
  };

  return (
    <Stack gap="xl">
      <Input.Wrapper
        label={t("loginPage.otp")}
        description={t("loginPage.emailOtpSent")}
        withAsterisk
      >
        <Group>
          <PinInput
            type="number"
            disabled={validateOtp.loading}
            onChange={inputHandler}
            oneTimeCode
            aria-required
            autoFocus
          />
          <Loader type="dots" />
        </Group>
      </Input.Wrapper>
      <Group justify="space-between">
        <Button
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
