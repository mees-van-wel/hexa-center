import { useTranslation } from "@/hooks/useTranslation";
import { useWrite } from "@/hooks/useWrite";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconMailFast } from "@tabler/icons-react";

type PhoneOtpProps = {
  onCompleted: () => any;
};

export const PhoneOtpInput = ({ onCompleted }: PhoneOtpProps) => {
  const sendEmailOtp = useWrite("POST", "/send-email-otp");
  const t = useTranslation();

  const clickHandler = async () => {
    await sendEmailOtp();
    onCompleted();
  };

  return (
    <Stack>
      <TextInput label={t("loginPage.email")} withAsterisk />
      <Button leftSection={<IconMailFast />}>
        {t("loginPage.sendEmailOtp")}
      </Button>
    </Stack>
  );
};
