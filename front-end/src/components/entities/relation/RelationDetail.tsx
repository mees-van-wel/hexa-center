"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Metadata } from "@/components/common/Metadata";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthRelation } from "@/contexts/AuthContext";
import { useAutosave } from "@/hooks/useAutosave";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  RelationUpdateInputSchema,
  RelationUpdateSchema,
} from "@/schemas/relation";
import { type RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Alert, Badge, Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { RelationForm } from "./RelationForm";

type RelationDetailProps = {
  relation: RouterOutput["relation"]["get"];
};

export const RelationDetail = ({ relation }: RelationDetailProps) => {
  const deleteRelation = useMutation("relation", "delete");
  const authRelation = useAuthRelation();
  const router = useRouter();
  const t = useTranslation();

  const formMethods = useForm({
    defaultValues: relation,
    resolver: valibotResolver(RelationUpdateSchema),
  });

  const isSelf = relation.id === authRelation.id;

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteRelation.mutate(relation.id);

        notifications.show({
          message: t("entities.relation.deletedNotification"),
          color: "green",
        });

        router.push("/relations");
      },
    });
  };

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
            { label: relation.name },
          ]}
        >
          {!isSelf && (
            <>
              <Button
                color="red"
                variant="light"
                onClick={deletehandler}
                leftSection={<IconTrash />}
                loading={deleteRelation.loading}
              >
                {t("common.delete")}
              </Button>
              <SaveBadge />
            </>
          )}
        </DashboardHeader>
        {isSelf && (
          <Alert
            icon={<IconAlertTriangle />}
            color="orange"
            title={t("entities.relation.isSelfAlert.title")}
          >
            {t("entities.relation.isSelfAlert.message") + " "}
            <Link href="/profile">
              {t("entities.relation.isSelfAlert.button")}
            </Link>
            .
          </Alert>
        )}
        <RelationForm disabled={isSelf} />
        {!isSelf && <Metadata />}
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateRelation = useMutation("relation", "update");
  const t = useTranslation();

  const { control, getValues, reset, setError } =
    useFormContext<RelationUpdateInputSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);

  useAutosave(control, async (values) => {
    function isJson(str: string) {
      if (!str) return { success: false, json: undefined };

      try {
        return { success: true, json: JSON.parse(str) };
      } catch (e) {
        return { success: false, json: undefined };
      }
    }

    try {
      const updatedRelation = await updateRelation.mutate({
        ...values,
        id: getValues("id"),
      });

      reset(updatedRelation);
    } catch (error) {
      // TODO Fix typings
      const { success, json } = isJson((error as any).message);
      if (!success) {
        notifications.show({
          message: t("common.oops"),
          color: "red",
        });

        reset();

        return;
      }

      const { exception, data } = json;

      if (exception === "DB_UNIQUE_CONSTRAINT") {
        setError(data.column, {
          message: `${t("entities.relation.name.singular")} - ${getValues(
            data.column,
          )} - ${data.column}`,

          // TODO Fix translations with arguments

          // message: t("exceptions.DB_UNIQUE_CONSTRAINT", {
          //   entity: t("entities.relation.name.singular"),
          //   value: getValues(data.column),
          //   column: data.column,
          // }),
        });
      }

      // if (exception === "DB_KEY_CONSTRAINT")
      //   notifications.show({
      //     message: t("exceptions.DB_KEY_CONSTRAINT", {
      //       depend: data.depend,
      //       entity: t("entities.relation.name.singular"),
      //     }),
      //     color: "red",
      //   });
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError ? "red" : isDirty || updateRelation.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateRelation.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateRelation.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
