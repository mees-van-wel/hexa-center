import {
  DEFAULT_SESSION_DURATION,
  SESSION_DURATIONS,
} from "@hexa-center/shared/constants/sessionDurations";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutation } from "@/hooks/useMutation";
import { Button, Group, Radio, Stack } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import { useState } from "react";
import { useLoginContext } from "./LoginContext";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export const RememberMe = () => {
  const login = useMutation("auth", "login");
  const [duration, setDuration] = useState<string>(DEFAULT_SESSION_DURATION);
  const { loginState, setLoginState } = useLoginContext();
  const { auth, setAuth } = useAuthContext();
  const t = useTranslation();
  const router = useRouter();

  const clickHandler = async () => {
    const user = await login.mutate({
      email: loginState.email,
      emailToken: loginState.emailToken,
      emailOtp: loginState.emailOtp,
      phoneNumber: loginState.phoneNumber,
      phoneNumberToken: loginState.phoneToken,
      phoneNumberOtp: loginState.phoneOtp,
      userAgent: navigator.userAgent,
      duration,
    });

    setAuth({ ...auth, user });
    setLoginState({ step: "SUCCESS" });

    setTimeout(() => {
      router.replace("/");
    }, 800);
  };

  return (
    <Stack>
      <Radio.Group
        name="rememberMe"
        label={t("loginPage.rememberMeFor")}
        value={duration}
        onChange={setDuration}
      >
        <Group mt="xs">
          <Radio
            value={SESSION_DURATIONS.SESSION}
            label={t("loginPage.thisSessionOnly.label")}
            description={t("loginPage.thisSessionOnly.description")}
          />
          <Radio
            value={SESSION_DURATIONS.DAY}
            label={t("loginPage.hours24.label")}
            description={t("loginPage.hours24.description")}
          />
          <Radio
            value={SESSION_DURATIONS.WEEK}
            label={t("loginPage.days7.label")}
            description={t("loginPage.days7.description")}
          />
          <Radio
            value={SESSION_DURATIONS.MONTH}
            label={t("loginPage.days30.label")}
            description={t("loginPage.days30.description")}
          />
        </Group>
      </Radio.Group>
      <Button
        leftSection={<IconLogin />}
        loading={login.loading}
        onClick={clickHandler}
      >
        {t("loginPage.login")}
      </Button>
    </Stack>
  );
};
