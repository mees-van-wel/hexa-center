"use client";

import { Button, Paper, Stack, Title } from "@mantine/core";
import { IconCheck, IconPlugConnected } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { type RouterOutput } from "@/utils/trpc";

type Step = "authorize" | "sync";

type TwinfieldDetailProps = {
  integration: RouterOutput["integration"]["get"];
};

export const TwinfieldDetail = ({ integration }: TwinfieldDetailProps) => {
  const t = useTranslation();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<Step>();
  const connectTwinfield = useMutation("integration", "connectTwinfield");
  const router = useRouter();

  // const twinfieldConnectHandler = () => {
  //   modals.open({
  //     title: <Title order={3}>Connect Twinfield</Title>,
  //     children: <TwinfieldConnectModal />,
  //   });
  // };

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || integration) return;

    const abortController = new AbortController();

    setLoading("authorize");

    (async () => {
      await connectTwinfield.mutate(code, { signal: abortController.signal });

      setLoading(undefined);
      router.replace("/integrations/twinfield");
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Stack>
      <DashboardHeader
        backRouteFallback="/integrations"
        title={[
          {
            href: "/integrations",
            label: t("screens.integrationsPage.pluralName"),
            icon: <IconPlugConnected />,
          },
          { label: "Twinfield" },
        ]}
      />
      <Paper p="md">
        <Stack>
          <div>
            <Title order={3} mb="xs">
              Step 1. Authorize
            </Title>
            <Button
              disabled={!!integration}
              loading={loading === "authorize"}
              leftSection={integration ? <IconCheck /> : undefined}
              component={!!integration ? "button" : "a"}
              // TODO dynamic redirect uri
              href="https://login.twinfield.com/auth/authentication/connect/authorize?client_id=book-a-room&redirect_uri=http://localhost:3000/integrations/twinfield&response_type=code&scope=openid+twf.organisationUser+twf.user+twf.organisation+offline_access&state=state&nonce=nonce"
            >
              Authorize
            </Button>
          </div>
          <div>
            <Title order={3} mb="xs">
              Step 2. Choose office
            </Title>
            <Button
              disabled={!!integration?.data?.companyCode}
              leftSection={
                integration?.data?.companyCode ? <IconCheck /> : undefined
              }
            >
              Choose
            </Button>
          </div>
          {/* <div>
            <Title order={3} mb="xs">
              Step 3. Syncing your customers
            </Title>
            <Button>Sync</Button>
          </div>
          <div>
            <Title order={3} mb="xs">
              Step 4. Selecting the correct ledgers
            </Title>
            <Button>Select</Button>
          </div> */}
        </Stack>
      </Paper>
    </Stack>
  );
};
