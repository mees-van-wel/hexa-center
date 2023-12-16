import { useTranslation } from "@/hooks/useTranslation";
import { useMutation } from "@/hooks/useMutation";
import { Button, Stack } from "@mantine/core";
import { IconDeviceMobileMessage } from "@tabler/icons-react";
import { Input } from "valibot";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { PhoneInput as PhoneInputComponent } from "@/components/common/PhoneInput";
import { useLoginContext } from "./LoginContext";
import { SendPhoneOtpSchema } from "@hexa-center/shared/schemas/auth";

type SendPhoneOtpSchema = Input<typeof SendPhoneOtpSchema>;

export const PhoneInput = () => {
  const sendPhoneOtp = useMutation("auth", "sendPhoneOtp");
  const { loginState, setLoginState } = useLoginContext();
  const t = useTranslation();

  const { control, handleSubmit } = useForm<SendPhoneOtpSchema>({
    resolver: valibotResolver(SendPhoneOtpSchema),
  });

  const onSubmit: SubmitHandler<SendPhoneOtpSchema> = async ({
    phoneNumber,
  }) => {
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
              defaultValue={loginState.phoneNumber}
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
