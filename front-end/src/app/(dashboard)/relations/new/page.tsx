"use client";

import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { RelationForm } from "@/components/entities/relation/RelationForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  RelationCreateInputSchema,
  RelationCreateSchema,
} from "@/schemas/relation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();

  const formMethods = useForm<RelationCreateInputSchema>({
    resolver: valibotResolver(RelationCreateSchema),
    defaultValues: {
      type: "individual",
      name: "",
      emailAddress: "",
      phoneNumber: "",
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
      region: "",
      country: null,
      dateOfBirth: null,
      sex: null,
      vatNumber: "",
      cocNumber: "",
      businessContactName: "",
      businessContactEmailAddress: "",
      businessContactPhoneNumber: "",
    },
  });

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/relations"
          title={[
            {
              icon: <IconUsers />,
              label: t("entities.relation.name.plural"),
              href: "/relations",
            },
            { label: t("common.new") },
          ]}
        >
          <SaveButton />
        </DashboardHeader>
        <RelationForm />
      </Stack>
    </FormProvider>
  );
}

const SaveButton = () => {
  const createRelation = useMutation("relation", "create");
  const router = useRouter();
  const t = useTranslation();

  const { control, handleSubmit } = useFormContext<RelationCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<RelationCreateInputSchema> = async (
    values,
  ) => {
    const response = await createRelation.mutate(values);

    notifications.show({
      message: t("entities.relation.createdNotification"),
      color: "green",
    });

    router.push(`/relations/${response.id}`);
  };

  return (
    <Button
      onClick={handleSubmit(submitHandler)}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createRelation.loading}
    >
      {t("common.save")}
    </Button>
  );
};
