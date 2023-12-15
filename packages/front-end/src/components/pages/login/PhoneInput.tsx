import { useTranslation } from "@/hooks/useTranslation";
import { useMutation } from "@/hooks/useMutation";
import { Button, Stack } from "@mantine/core";
import { IconDeviceMobileMessage } from "@tabler/icons-react";
import { Input, object, string } from "valibot";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { PhoneInput as PhoneInputComponent } from "@/components/common/PhoneInput";
import { useLoginContext } from "./LoginContext";

const PhoneInputSchema = object({
  phoneNumber: string(),
});

type PhoneInputSchema = Input<typeof PhoneInputSchema>;

export const PhoneInput = () => {
  const sendPhoneOtp = useMutation("auth", "sendPhoneOtp");
  const { setLoginState } = useLoginContext();
  const t = useTranslation();

  const { control, handleSubmit } = useForm<PhoneInputSchema>({
    resolver: valibotResolver(PhoneInputSchema),
  });

  const onSubmit: SubmitHandler<PhoneInputSchema> = async ({ phoneNumber }) => {
    const phoneToken = await sendPhoneOtp.mutate({ phoneNumber });

    setLoginState({
      step: "PHONE_OTP",
      phoneNumber,
      phoneToken,
    });
  };

  return (
    <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field, fieldState: { error } }) => (
            <PhoneInputComponent
              {...field}
              value={field.value}
              error={error?.message}
              label={t("loginPage.phoneNumber")}
              autoComplete
              withAsterisk
              autoFocus
            />
          )}
        />
        <Button
          type="submit"
          leftSection={<IconDeviceMobileMessage />}
          loading={sendPhoneOtp.loading}
        >
          {t("loginPage.sendPhoneOtp")}
        </Button>
      </Stack>
    </form>
  );
};
