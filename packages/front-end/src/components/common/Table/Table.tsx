"use client";

import { Paper, Table as TableComponent, TextInput } from "@mantine/core";
import { useId, useMemo } from "react";
import styles from "./Table.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchState } from "@/states/searchState";

const random = new Date().toISOString();

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
  // TOOD Push id to search state and update accordingly from search input
  const id = useId();
  const search = useRecoilValue(searchState);

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
      {random}
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
    </Paper>
  );
};

const SearchBar = () => {
  const [search, setSearch] = useRecoilState(searchState);

  return (
    <>
      {random}
      <TextInput
        value={search}
        placeholder="Search"
        className={styles.searchInput}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </>
  );
};

Table.SearchBar = SearchBar;
