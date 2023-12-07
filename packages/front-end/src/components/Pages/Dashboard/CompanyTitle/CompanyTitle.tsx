"use client"

import { Group, Stack, Title } from "@mantine/core";
import Icon from "@/assets/images/icon-white.svg"
import Image from "next/image";
import { useCompanyName } from "@/hooks/useCompanyName";

export default function CompanyTitle() {
  const companyName = useCompanyName();

  return (
    <Group justify="center" pb="md">
      <Image alt="Icon" src={Icon} width={64} height={64} />
      <Stack gap={0}>
        <Title order={1}>
          Hexa Center
        </Title>
        {companyName && 
          <Title order={6}>
            {companyName}
          </Title>
        }
      </Stack>
    </Group>
  );
}
