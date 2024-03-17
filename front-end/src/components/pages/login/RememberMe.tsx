import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  DEFAULT_SESSION_DURATION,
  SESSION_DURATIONS,
} from "@/constants/sessionDurations";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Group, Radio, Stack } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";

import { useLoginContext } from "./LoginContext";

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
      phone: loginState.phone,
      phoneToken: loginState.phoneToken,
      phoneOtp: loginState.phoneOtp,
      userAgent: navigator.userAgent,
      duration,
    });

    const main = document.querySelector("main");
    main?.setAttribute("data-fade", "true");
    window.localStorage.setItem("fade", "true");

    setAuth({ ...auth, user });
    setLoginState({ step: "SUCCESS" });

    setTimeout(() => {
      router.replace("/");
    }, 2000);
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
