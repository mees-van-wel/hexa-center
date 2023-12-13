import { useTranslation } from "@/hooks/useTranslation";
import { useWrite } from "@/hooks/useWrite";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconMailFast } from "@tabler/icons-react";
import { Input, object, string, email } from "valibot";
import { SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useLoginContext } from "./LoginContext";

const EmailInputSchema = object({
  email: string([email()]),
});

type EmailInputSchema = Input<typeof EmailInputSchema>;

export const EmailInput = () => {
  const sendEmailOtp = useWrite("POST", "/send-email-otp");
  const { setLoginState } = useLoginContext();
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailInputSchema>({
    resolver: valibotResolver(EmailInputSchema),
  });

  const onSubmit: SubmitHandler<EmailInputSchema> = async ({ email }) => {
    const response = await sendEmailOtp.execute({ email });

    setLoginState({
      step: "EMAIL_OTP",
      email,
      emailToken: response.token,
    });
  };

  return (
    <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          {...register("email")}
          error={errors.email?.message}
          label={t("loginPage.email")}
          type="email"
          autoComplete="email"
          withAsterisk
          autoFocus
        />
        <Button
          type="submit"
          leftSection={<IconMailFast />}
          loading={sendEmailOtp.loading}
        >
          {t("loginPage.sendEmailOtp")}
        </Button>
      </Stack>
    </form>
  );
};
