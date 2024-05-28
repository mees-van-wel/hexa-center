"use client";

import { Paper, Table as TableComponent } from "@mantine/core";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import { searchState } from "@/states/searchState";

import { SearchBar } from "./SearchBar";
import styles from "./Table.module.scss";

type TableProps<T extends Record<string, any>> = {
  searchBarId?: string;
  columns: {
    selector: keyof T;
    // TODO Typings
    format?: (values: T) => React.ReactNode;
    label: string;
  }[];
  elements: T[];
  onClick?: (row: T) => any;
};

export const Table = <T extends Record<string, any>>({
  searchBarId,
  columns,
  elements,
  onClick,
}: TableProps<T>) => {
  const search = useRecoilValue(searchState);

  const filtered = useMemo(() => {
    if (!searchBarId) return elements;

    const val = search[searchBarId];
    if (!val) return elements;

    const searchLower = val.toLowerCase();
    return elements.filter((element) =>
      Object.values(element).some((value) =>
        value?.toString().toLowerCase().includes(searchLower),
      ),
    );
  }, [searchBarId, search, elements]);

  return (
    <Paper p="md">
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
              {columns.map(({ selector, format }) => (
                <TableComponent.Td key={selector as string}>
                  {format ? format(element) : element[selector]}
                </TableComponent.Td>
              ))}
            </TableComponent.Tr>
          ))}
        </TableComponent.Tbody>
      </TableComponent>
    </Paper>
  );
};

Table.SearchBar = SearchBar;
