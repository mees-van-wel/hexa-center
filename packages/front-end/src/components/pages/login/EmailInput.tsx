import { useTranslation } from "@/hooks/useTranslation";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconMailFast } from "@tabler/icons-react";
import { Input } from "valibot";
import { SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useLoginContext } from "./LoginContext";
import { SendEmailOtpSchema } from "@hexa-center/shared/schemas/auth";
import { useMutation } from "@/hooks/useMutation";

type SendEmailOtpSchema = Input<typeof SendEmailOtpSchema>;

export const EmailInput = () => {
  const sendEmailOtp = useMutation("auth", "sendEmailOtp");
  const { setLoginState } = useLoginContext();
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendEmailOtpSchema>({
    resolver: valibotResolver(SendEmailOtpSchema),
  });

  const onSubmit: SubmitHandler<SendEmailOtpSchema> = async ({ email }) => {
    const emailToken = await sendEmailOtp.mutate({ email });

    setLoginState({
      step: "EMAIL_OTP",
      email,
      emailToken,
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
