"use client";

import { Button, Paper, Stack, Table } from "@mantine/core";
import styles from "./page.module.scss";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import useMemory from "@/hooks/useMemory";
import { readRooms } from "@/server/actions";
import { useTranslation } from "@/hooks/useTranslation";

// TODO: database data
const roos = [
  {
    id: 1,
    name: "Tony's kamer",
    price: 100,
  },
  {
    id: 2,
    name: "Damian's kamer",
    price: 200,
  },
];

export default function Rooms() {
  const router = useRouter();
  const t = useTranslation();

  const [rooms, { fetch }] = useMemory({
    name: "readRooms",
    action: readRooms,
  });

  const rows = roos.map(({ name, price, id }) => (
    <Table.Tr
      onClick={() => router.push(`/rooms/${id}`)}
      key={name}
      className={styles.roomColumn}
    >
      <Table.Td>{name}</Table.Td>
      <Table.Td>{price}</Table.Td>
      <Table.Td>{id}</Table.Td>
    </Table.Tr>
  ));

  return (
    <main>
      <Stack>
        <Paper p="md">
          <Button
            onClick={() => {
              alert("Add new Room");
            }}
          >
            Create
          </Button>
        </Paper>
        <Paper p="md">
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("rooms.name")}</Table.Th>
                <Table.Th>{t("rooms.price")}</Table.Th>
                <Table.Th>{t("common.number")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </main>
  );
}
