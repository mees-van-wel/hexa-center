"use client";

import { useMemo } from "react";
import parse from "html-react-parser";

import { Sheet } from "@/components/common/Sheet";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthRelation } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";

import styles from "./home.module.scss";
const data = [
  {
    name: "Minor update v1.2.0",
    image: "url1",
    content: "We have added the following: We have added We have added",
    date: "09-05-2000",
    slug: "slug1",
  },
  {
    name: "Patch update v1.1.1",
    image: "url2",
    content: "We have patched the following: We have patched We have patched",
    date: "02-01-2024",
    slug: "slug2",
  },
  {
    name: "Patch update v1.1.1",
    image: "url2",
    content: "We have patched the following: We have patched We have patched",
    date: "02-01-2024",
    slug: "slug2",
  },
  {
    name: "Patch update v1.1.1",
    image: "url2",
    content: "We have patched the following: We have patched We have patched",
    date: "02-01-2024",
    slug: "slug2",
  },
  {
    name: "Patch update v1.1.1",
    image: "url2",
    content: "We have patched the following: We have patched We have patched",
    date: "02-01-2024",
    slug: "slug2",
  },
  {
    name: "Patch update v1.1.1",
    image: "url2",
    content: "We have patched the following: We have patched We have patched",
    date: "02-01-2024",
    slug: "slug2",
  },
  {
    name: "Patch update v1.1.1",
    image: "url2",
    content: "We have patched the following: We have patched We have patched",
    date: "02-01-2024",
    slug: "slug2",
  },
];

export default function Page() {
  const t = useTranslation();
  const authUser = useAuthRelation();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t("homePage.goodMorning");
    else if (hour >= 12 && hour < 18) return t("homePage.goodAfternoon");
    return t("homePage.goodEvening");
  }, [t]);

  return (
    <>
      <DashboardHeader title={[{ label: "Home", icon: <IconHome /> }]} />
      <Group justify="space-between" align="flex-start" p="md">
        <Sheet title={t("homePage.welcome")} glass>
          <Title>
            {greeting} {authUser.name}
          </Title>
        </Sheet>
        <Sheet title={t("homePage.news")} glass>
          <Stack gap={"md"} className={styles.wrapper}>
            {data.map(({ name, image, content, date, slug }) => (
              <Card key={slug} shadow="sm" p={0} className={styles.news}>
                <Badge variant="light" className={styles.newsDate}>
                  {new Date(date).toLocaleDateString("nl-NL")}
                </Badge>
                {image && <Card.Section m={0} />}
                <Stack p={16}>
                  <Title
                    style={{
                      lineHeight: 1,
                    }}
                    mt={-4}
                    order={5}
                  >
                    {name}
                  </Title>
                  <Text size="xs">
                    {parse(`${content.substring(0, 50)}...`)}
                  </Text>
                </Stack>
                <Button
                  style={{
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                  target="_blank"
                  href={`https://hexa.center/news/${slug}`}
                  variant="light"
                  fullWidth
                  component="a"
                >
                  {t("homePage.read")}
                </Button>
              </Card>
            ))}
          </Stack>
        </Sheet>
      </Group>
    </>
  );
}
