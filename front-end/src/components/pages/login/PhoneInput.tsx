import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { SendPhoneOtpSchema } from "@shared/schemas/auth";
import { IconDeviceMobileMessage } from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "valibot";

import { PhoneInput as PhoneInputComponent } from "@/components/common/PhoneInput";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";

import { useLoginContext } from "./LoginContext";

type SendPhoneOtpSchema = Input<typeof SendPhoneOtpSchema>;

export const PhoneInput = () => {
  const sendPhoneOtp = useMutation("auth", "sendPhoneOtp");
  const { loginState, setLoginState } = useLoginContext();
  const t = useTranslation();

  const { control, handleSubmit } = useForm<SendPhoneOtpSchema>({
    defaultValues: { phone: loginState.phone },
    resolver: valibotResolver(SendPhoneOtpSchema),
  });

  const onSubmit: SubmitHandler<SendPhoneOtpSchema> = async ({ phone }) => {
    const phoneToken = await sendPhoneOtp.mutate({ phone });
    setLoginState({
      step: "PHONE_OTP",
      phone,
      phoneToken,
    });
  };

  return (
    <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState: { error } }) => (
            <PhoneInputComponent
              {...field}
              value={control._defaultValues.phone}
              error={error?.message}
              label={t("loginPage.phone")}
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
