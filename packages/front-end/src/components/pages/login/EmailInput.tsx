import { useTranslation } from "@/hooks/useTranslation";
import { useWrite } from "@/hooks/useWrite";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconMailFast } from "@tabler/icons-react";
import { Input, object, string, email } from "valibot";
import { SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

type EmailInputProps = {
  onCompleted: () => any;
};

const EmailInputSchema = object({
  email: string([email()]),
});

type EmailInputSchema = Input<typeof EmailInputSchema>;

export const EmailInput = ({ onCompleted }: EmailInputProps) => {
  const sendEmailOtp = useWrite("POST", "/send-email-otp");
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailInputSchema>({
    resolver: valibotResolver(EmailInputSchema),
  });

  const onSubmit: SubmitHandler<EmailInputSchema> = async ({ email }) => {
    await sendEmailOtp.execute({
      email,
    });

    onCompleted();
  };

  return (
    <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="xl">
        <TextInput
          {...register("email")}
          error={errors.email?.message}
          label={t("loginPage.email")}
          type="email"
          id="email"
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
