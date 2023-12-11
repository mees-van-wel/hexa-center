import { useTranslation } from "@/hooks/useTranslation";
import { useWrite } from "@/hooks/useWrite";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconMailFast } from "@tabler/icons-react";
import { Input, object, string } from "valibot";
import { SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

type PhoneInputProps = {
  onCompleted: () => any;
};

const PhoneInputSchema = object({
  phone: string(),
});

type PhoneInputSchema = Input<typeof PhoneInputSchema>;

export const PhoneInput = ({ onCompleted }: PhoneInputProps) => {
  const sendPhoneOtp = useWrite("POST", "/send-phone-otp");
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneInputSchema>({
    resolver: valibotResolver(PhoneInputSchema),
  });

  const onSubmit: SubmitHandler<PhoneInputSchema> = async ({ phone }) => {
    await sendPhoneOtp.execute({
      phone,
    });

    onCompleted();
  };

  return (
    <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          {...register("phone")}
          error={errors.phone?.message}
          label={t("loginPage.phone")}
          type="tel"
          id="phone"
          autoComplete="tel"
          withAsterisk
          autoFocus
        />
        <Button
          type="submit"
          leftSection={<IconMailFast />}
          loading={sendPhoneOtp.loading}
        >
          {t("loginPage.sendPhoneOtp")}
        </Button>
      </Stack>
    </form>
  );
};
