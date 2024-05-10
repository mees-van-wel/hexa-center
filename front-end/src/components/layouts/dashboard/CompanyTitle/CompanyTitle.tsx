"use client";

import { Group, Stack, Title } from "@mantine/core";
import Image from "next/image";

import iconBlack from "@/assets/images/icon-black.svg";
import iconWhite from "@/assets/images/icon-white.svg";
import { useCompanyName } from "@/hooks/useCompanyName";
import { isProduction } from "@/utils/environment";

export const CompanyTitle = () => {
  const companyName = useCompanyName();

  return (
    <Group justify="center" pb="md">
      <Image
        alt="Icon"
        src={isProduction ? iconBlack : iconWhite}
        width={48}
        height={48}
      />
      <Stack gap={0}>
        <Title order={2}>Hexa Center</Title>
        {companyName && <Title order={6}>{companyName}</Title>}
      </Stack>
    </Group>
  );
};
