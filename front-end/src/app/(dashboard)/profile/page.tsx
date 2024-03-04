"use client";

import { FormProvider, useForm } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Sheet } from "@/components/common/Sheet";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { SEX_VALUES, SexKey } from "@/constants/sexes";
import { useAuthRelation } from "@/contexts/AuthContext";
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
  const authUser = useAuthRelation();

  const formMethods = useForm({
    defaultValues: authUser,
  });

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
            <Group>
              <Avatar size="lg" />
              <Group
                grow
                style={{
                  flex: 1,
                }}
              >
                <TextInput
                  label={t("entities.relation.keys.name")}
                  value={authUser.name}
                  required
                />
                <DateInput
                  label={t("entities.relation.keys.dateOfBirth")}
                  value={authUser.dateOfBirth}
                />
                <Select
                  label={t("entities.relation.keys.sex")}
                  data={SEX_VALUES.map((sex: SexKey) => ({
                    label: t(`constants.sexes.${sex}`),
                    value: sex,
                  }))}
                  value={authUser.sex}
                  allowDeselect={false}
                />
              </Group>
            </Group>
            <Address disabled={false} />
          </Stack>
        </Paper>
        <Sheet title={t("generic.authentication")}>
          <Stack>
            <Group>
              <p>{t("entities.relation.keys.emailAddress")}:</p>
              <Badge variant="dot" color="orange">
                {authUser.emailAddress}
              </Badge>
            </Group>
            <Group>
              <p>{t("entities.relation.keys.phoneNumber")}:</p>
              <Badge variant="dot" color="orange">
                {authUser.phoneNumber}
              </Badge>
            </Group>
          </Stack>
        </Sheet>
      </Stack>
    </FormProvider>
  );
}
