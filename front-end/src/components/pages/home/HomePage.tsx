"use client";

import { useMemo } from "react";
import Image from "next/image";
import parse from "html-react-parser";

import { NewsItem } from "@/app/(dashboard)/page";
import { Sheet } from "@/components/common/Sheet";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthRelation } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Badge,
  Button,
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconHome } from "@tabler/icons-react";

import styles from "./HomePage.module.scss";

export default function HomePage({ newsItems }: { newsItems: NewsItem[] }) {
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
          <ScrollArea
            className={styles.wrapper}
            h="calc(100vh - 70px - 8.5rem)"
          >
            <Stack gap="xl">
              {newsItems.map(({ slug, html, data: { title, date, image } }) => (
                <Card key={slug} shadow="sm" p={0} className={styles.news}>
                  {image && (
                    <Card.Section m={0}>
                      <Image
                        src={`https://www.hexa.center${image}`}
                        width={350}
                        height={150}
                        alt={title}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    </Card.Section>
                  )}
                  <Stack p={16}>
                    <Group wrap="nowrap">
                      <Title
                        style={{
                          flex: 1,
                        }}
                        mt={-4}
                        order={3}
                      >
                        {title}
                      </Title>
                      <Badge variant="light" className={styles.newsDate}>
                        {new Date(date).toLocaleDateString("nl-NL")}
                      </Badge>
                    </Group>
                    <Text size="xs" px="md">
                      {parse(`${html.substring(0, 100)}...`)}
                    </Text>
                  </Stack>
                  <Button
                    style={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                    target="_blank"
                    href={`https://hexa.center/news/${slug}`}
                    fullWidth
                    component="a"
                    variant="light"
                  >
                    {t("homePage.read")}
                  </Button>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        </Sheet>
      </Group>
    </>
  );
}
