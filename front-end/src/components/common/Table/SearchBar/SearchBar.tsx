import { useRecoilState } from "recoil";

import { useTranslation } from "@/hooks/useTranslation";
import { searchState } from "@/states/searchState";
import { TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import styles from "./SearchBar.module.scss";

type SearchBarProps = {
  id: string;
};

export const SearchBar = ({ id }: SearchBarProps) => {
  const [search, setSearch] = useRecoilState(searchState);
  const t = useTranslation();

  const clearHandler = () => {
    const clone = Object.assign({}, search);
    delete clone[id];
    setSearch(clone);
  };

  const value = search[id];

  return (
    <TextInput
      value={value || ""}
      placeholder={t("components.table.searchNar.quickSearch")}
      className={styles.input}
      onChange={(e) => {
        setSearch({ ...search, [id]: e.target.value });
      }}
      rightSection={
        value ? (
          <IconX className={styles.clearIcon} onClick={clearHandler} />
        ) : undefined
      }
    />
  );
};
