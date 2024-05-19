"use client";

import { Button, Stack } from "@mantine/core";
import { IconPlus, IconUserDollar } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";

import { Loading } from "@/components/common/Loading";
import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";

export default function Page() {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  const listCustomers = useQuery("customer", "list");

  if (listCustomers.loading || !listCustomers.data) return <Loading />;

  return (
    <Stack>
      <DashboardHeader
        title={[
          {
            icon: <IconUserDollar />,
            label: t("entities.customer.pluralName"),
          },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/customers/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        elements={listCustomers.data.sort((a, b) =>
          a.name.localeCompare(b.name),
        )}
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/customers/${id}`);
        }}
        columns={[
          {
            selector: "name",
            label: t("common.name"),
            format: ({ name, contactPersonName }) =>
              contactPersonName ? `${name} - ${contactPersonName}` : name,
          },
          {
            selector: "email",
            label: t("common.email"),
            format: ({ email, contactPersonEmail }) =>
              `${email || ""}${email && contactPersonEmail ? " - " : ""}${
                contactPersonEmail || ""
              }`,
          },
          {
            selector: "phone",
            label: t("common.phone"),
            format: ({ phone, contactPersonPhone }) =>
              `${phone || ""}${phone && contactPersonPhone ? " - " : ""}${
                contactPersonPhone || ""
              }`,
          },
          {
            selector: "id",
            label: t("common.number"),
          },
        ]}
      />
    </Stack>
  );
}
