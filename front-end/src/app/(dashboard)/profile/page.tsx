"use client";

import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Sheet } from "@/components/common/Sheet";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { SEX_VALUES, SexKey } from "@/constants/sexes";
import { useAuthUser } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Avatar,
  Badge,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconUser } from "@tabler/icons-react";

export default function Profile() {
  const t = useTranslation();
  const authUser = useAuthUser();

  const formMethods = useForm({
    defaultValues: authUser,
  });

  const sexOptions = useMemo(
    () =>
      SEX_VALUES.map((sex: SexKey) => ({
        label: t(`constants.sexes.${sex}`),
        value: sex,
      })),
    [t],
  );

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          title={[
            { icon: <IconUser />, label: t("dashboardLayout.avatar.profile") },
          ]}
        ></DashboardHeader>
        <Paper p="md">
          <Stack>
            <Group align="end">
              <Avatar size="lg" />
              <TextInput
                label={t("entities.user.firstName")}
                value={authUser.firstName}
                required
                disabled
              />
              <TextInput
                label={t("entities.user.lastName")}
                value={authUser.lastName}
                required
                disabled
              />
              <DateInput
                label={t("entities.user.birthDate")}
                value={authUser.birthDate}
                disabled
              />
              <Select
                label={t("entities.user.sex")}
                data={sexOptions}
                value={authUser.sex}
                allowDeselect={false}
                disabled
              />
            </Group>
            <Address disabled />
          </Stack>
        </Paper>
        <Sheet title={t("generic.authentication")}>
          <Stack>
            <Group>
              <p>{t("common.email")}:</p>
              <Badge variant="dot">{authUser.email}</Badge>
            </Group>
            <Group>
              <p>{t("common.phone")}:</p>
              <Badge variant="dot">{authUser.phone}</Badge>
            </Group>
          </Stack>
        </Sheet>
      </Stack>
    </FormProvider>
  );
}
