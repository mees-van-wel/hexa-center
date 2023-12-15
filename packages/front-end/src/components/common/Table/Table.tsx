"use client";

import {
  Paper,
  Stack,
  Table as TableComponent,
  TextInput,
} from "@mantine/core";
import { useMemo, useState } from "react";
import styles from "./Table.module.scss";

type TableProps<T extends Record<string, any>> = {
  columns: {
    selector: keyof T;
    label: string;
  }[];
  elements: T[];
  onClick?: (row: T) => any;
};

export const Table = <T extends Record<string, any>>({
  columns,
  elements,
  onClick,
}: TableProps<T>) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return elements;
    const searchLower = search.toLowerCase();
    return elements.filter((element) =>
      Object.values(element).some((value) =>
        value.toString().toLowerCase().includes(searchLower),
      ),
    );
  }, [search, elements]);

  return (
    <Paper p="md">
      <Stack>
        <TextInput
          value={search}
          placeholder="Search"
          className={styles.searchInput}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <TableComponent highlightOnHover>
          <TableComponent.Thead>
            <TableComponent.Tr>
              {columns.map(({ selector, label }) => (
                <TableComponent.Th key={selector as string}>
                  {label}
                </TableComponent.Th>
              ))}
            </TableComponent.Tr>
          </TableComponent.Thead>
          <TableComponent.Tbody>
            {filtered.map((element, index) => (
              <TableComponent.Tr
                key={index}
                className={onClick ? styles.clickableRow : undefined}
                onClick={onClick ? () => onClick(element) : undefined}
              >
                {columns.map(({ selector }) => (
                  <TableComponent.Td key={selector as string}>
                    {element[selector]}
                  </TableComponent.Td>
                ))}
              </TableComponent.Tr>
            ))}
          </TableComponent.Tbody>
        </TableComponent>
      </Stack>
    </Paper>
  );
};
