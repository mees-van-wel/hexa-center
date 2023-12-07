import { Badge, Button, Group, Stack, Title } from "@mantine/core";
import styles from "./page.module.scss";
import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";
import { ROUTES } from "@/constants/routes";
import { IconBed } from "@tabler/icons-react";

export default function Home() {
  return (
    <main className={styles.main}>
      <DashboardHeader title={[{content: "Home", href: ""}]}>
        <Group>
          <Button>Create</Button>
          <Badge size="lg" color="green">Saved</Badge>
        </Group>
      </DashboardHeader>
      <Title>CONTEXT</Title>
    </main>
  );
}
