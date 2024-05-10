"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Alert,
  Badge,
  Button,
  Flex,
  Loader,
  Paper,
  Stack,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Metadata } from "@/components/common/Metadata";
import { UserForm } from "@/components/entities/user/UserForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAutosave } from "@/hooks/useAutosave";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { UserUpdateInputSchema, UserUpdateSchema } from "@/schemas/user";
import { RouterOutput } from "@/utils/trpc";

type PageParams = { params: { id: string } };

export default function Page({ params }: PageParams) {
  const getUser = useQuery("user", "get", {
    initialParams: parseInt(params.id),
  });

  if (getUser.loading || !getUser.data)
    return (
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
        component={Paper}
        p="md"
      >
        <Loader />
      </Flex>
    );

  return <Detail user={getUser.data} />;
}

type DetailProps = {
  user: RouterOutput["user"]["get"];
};

const Detail = ({ user }: DetailProps) => {
  const deleteUser = useMutation("user", "delete");
  const authUser = useAuthUser();
  const memory = useMemory();
  const router = useRouter();
  const t = useTranslation();

  const formMethods = useForm({
    defaultValues: user,
    resolver: valibotResolver(UserUpdateSchema),
  });

  const isSelf = user.id === authUser.id;

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteUser.mutate(user.id);

        memory.evict(user);

        notifications.show({
          message: t("entities.user.deletedNotification"),
          color: "green",
        });

        router.push("/users");
      },
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/users"
          title={[
            {
              icon: <IconUsers />,
              label: t("entities.user.pluralName"),
              href: "/users",
            },
            { label: `${user.firstName} ${user.lastName}` },
          ]}
        >
          {!isSelf && (
            <>
              <Button
                color="red"
                variant="light"
                onClick={deletehandler}
                leftSection={<IconTrash />}
                loading={deleteUser.loading}
              >
                {t("common.delete")}
              </Button>
              <SaveBadge />
            </>
          )}
        </DashboardHeader>
        {isSelf && (
          <Paper>
            <Alert
              icon={<IconAlertTriangle />}
              color="orange"
              title={t("entities.user.isSelfAlertTitle")}
            >
              {/* {t("entities.user.isSelfAlertMessage") + " "}
            <Link href="/profile">
              {t("entities.user.isSelfAlertButton")}
            </Link>
            . */}
            </Alert>
          </Paper>
        )}
        <UserForm disabled={isSelf} />
        {!isSelf && <Metadata />}
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateUser = useMutation("user", "update");
  const memory = useMemory();
  const t = useTranslation();

  const { control, getValues, reset, setError } =
    useFormContext<UserUpdateInputSchema>();
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
      // @ts-ignore Fix this
      const updatedUser = await updateUser.mutate({
        ...values,
        id: getValues("id"),
      });

      memory.update(updatedUser);
      reset(updatedUser);
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
          message: `${t("entities.user.singularName")} - ${getValues(
            data.column,
          )} - ${data.column}`,

          // TODO Fix translations with arguments

          // message: t("exceptions.DB_UNIQUE_CONSTRAINT", {
          //   entity: t("entities.user.singularName"),
          //   value: getValues(data.column),
          //   column: data.column,
          // }),
        });
      }

      // if (exception === "DB_KEY_CONSTRAINT")
      //   notifications.show({
      //     message: t("exceptions.DB_KEY_CONSTRAINT", {
      //       depend: data.depend,
      //       entity: t("entities.user.singularName"),
      //     }),
      //     color: "red",
      //   });
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError ? "red" : isDirty || updateUser.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateUser.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateUser.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
