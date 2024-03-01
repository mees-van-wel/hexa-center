"use client";

import { FormProvider, useForm } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { SEX_VALUES, SexKey } from "@/constants/sexes";
import { useAuthRelation } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Avatar, Group, Paper, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconUser } from "@tabler/icons-react";

export default function Profile() {
  const t = useTranslation();
  const authUser = useAuthRelation();

  const formMethods = useForm({
    // defaultValues: relation,
    // resolver: valibotResolver(RelationUpdateSchema),
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
              <Avatar radius="xl" size="lg">
                {authUser.name}
              </Avatar>
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
      </Stack>
    </FormProvider>
  );
}
