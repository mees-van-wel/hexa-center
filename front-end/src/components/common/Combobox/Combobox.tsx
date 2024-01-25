"use client";

import React, { forwardRef, ReactNode, useEffect, useMemo } from "react";

import {
  Combobox as ComboboxComponent,
  getOptionsLockup,
  getParsedComboboxData,
  InputBase,
  ScrollArea,
  Text,
  useCombobox,
} from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";

type ComboboxItem = {
  label: string;
  value: string;
  description?: string;
};

type ComboboxProps = {
  data: ComboboxItem[];
  styles?: {
    root?: React.CSSProperties;
    input?: React.CSSProperties;
  };
  classNames?: {
    root?: string;
    input?: string;
  };
  value?: string | null;
  defaultValue?: string | null;
  label?: string;
  description?: string;
  error?: ReactNode | string;
  autoComplete?: string;
  searchValue?: string;
  defaultSearchValue?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  allowDeselect?: boolean;
  filter?: (
    value: ComboboxItem,
    index: number,
    array: ComboboxItem[],
  ) => ComboboxItem[];
  onChange?: (value: string | null) => void;
  onSearchChange?: (value: string) => void;
};

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      styles,
      classNames,
      data,
      value,
      defaultValue,
      searchValue,
      defaultSearchValue,
      searchable,
      clearable,
      disabled,
      allowDeselect,
      required,
      filter,
      onChange,
      onSearchChange,
      ...others
    },
    ref,
  ) => {
    const parsedData = useMemo(() => getParsedComboboxData(data), [data]);
    const optionsLockup = useMemo(
      () => getOptionsLockup(parsedData),
      [parsedData],
    );

    const [stateValue, setStateValue] = useUncontrolled({
      value,
      defaultValue,
      finalValue: null,
      onChange,
    });

    const selectedOption =
      typeof stateValue === "string" ? optionsLockup[stateValue] : undefined;

    const [search, setSearch] = useUncontrolled({
      value: searchValue,
      defaultValue: defaultSearchValue,
      finalValue: selectedOption ? selectedOption.label : "",
      onChange: onSearchChange,
    });

    const combobox = useCombobox({
      onDropdownClose: () => {
        combobox.resetSelectedOption();
      },
    });

    useEffect(() => {
      if (typeof value === "string" && selectedOption) {
        // TODO Fix this, sometimes it overwrites search input
        setSearch(selectedOption.label);
      }
    }, [value, selectedOption, setSearch]);

    const clearButton = clearable && !!stateValue && !disabled && (
      <ComboboxComponent.ClearButton
        onClear={() => {
          setStateValue(null);
          setSearch("");
        }}
      />
    );

    return (
      <ComboboxComponent
        store={combobox}
        withinPortal={false}
        onOptionSubmit={(val) => {
          const nextValue = allowDeselect
            ? optionsLockup[val].value === stateValue
              ? null
              : optionsLockup[val].value
            : optionsLockup[val].value;

          setStateValue(nextValue);
          setSearch(
            typeof nextValue === "string" ? optionsLockup[val].label : "",
          );
          combobox.closeDropdown();
        }}
      >
        <ComboboxComponent.Target targetType={searchable ? "input" : "button"}>
          <InputBase
            classNames={{
              root: classNames?.root,
              input: classNames?.input,
            }}
            styles={{
              root: styles?.root,
              input: styles?.input,
            }}
            rightSection={clearButton || <ComboboxComponent.Chevron />}
            rightSectionPointerEvents={clearButton ? "all" : "none"}
            ref={ref}
            {...others}
            disabled={disabled}
            readOnly={!searchable}
            withAsterisk={required}
            required={required}
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              combobox.openDropdown();
            }}
            onFocus={() => {
              searchable && combobox.openDropdown();
            }}
            onBlur={() => {
              searchable && combobox.closeDropdown();

              setSearch(
                stateValue != null
                  ? optionsLockup[stateValue]?.label || ""
                  : "",
              );
            }}
            onClick={() => {
              searchable ? combobox.openDropdown() : combobox.toggleDropdown();
            }}
            pointer={!searchable}
          />
        </ComboboxComponent.Target>
        <ComboboxComponent.Dropdown hidden={disabled} p={0}>
          <ComboboxComponent.Options>
            <ScrollArea.Autosize type="always" mah={300}>
              {(filter ? data.filter(filter) : data).map((item) => (
                <ComboboxComponent.Option
                  value={item.value}
                  key={item.value}
                  title={item.description}
                >
                  {item.label}
                  {item.description && (
                    <Text size="xs" opacity={0.6}>
                      {item.description}
                    </Text>
                  )}
                </ComboboxComponent.Option>
              ))}
            </ScrollArea.Autosize>
          </ComboboxComponent.Options>
        </ComboboxComponent.Dropdown>
      </ComboboxComponent>
    );
  },
);

Combobox.displayName = "Combobox";
