"use client";

import { forwardRef, useMemo, useRef, useState } from "react";
import { parsePhoneNumber } from "awesome-phonenumber";
import { mergeRefs } from "react-merge-refs";

import {
  COUNTRIES,
  COUNTRY_VALUES,
  CountryKey,
  DEFAULT_COUNTRY,
} from "@/constants/countries";
import { useTranslation } from "@/hooks/useTranslation";
import { Group } from "@mantine/core";
import { Input } from "@mantine/core";
import { useDidUpdate, useId, useLocalStorage } from "@mantine/hooks";

import { Combobox } from "../Combobox";

import styles from "./PhoneInput.module.scss";

type PhoneInputProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => any;
  disabled?: boolean;
  autoComplete?: boolean;
  autoFocus?: boolean;
  withAsterisk?: boolean;
  style?: React.CSSProperties;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      description,
      error,
      required,
      value,
      defaultValue,
      onChange,
      disabled,
      autoFocus,
      withAsterisk,
      autoComplete,
      style,
    },
    ref,
  ) => {
    const id = useId();
    const t = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const parsedPhone = useMemo(
      () => (value ? parsePhoneNumber(value) : undefined),
      [value],
    );

    const parsedDefaultPhone = useMemo(
      () => (defaultValue ? parsePhoneNumber(defaultValue) : undefined),
      [defaultValue],
    );

    const [storedCountryCode, setStoredRegionCode] =
      useLocalStorage<CountryKey>({
        key: "phoneInput.countryCode",
        defaultValue: DEFAULT_COUNTRY.countryCode,
      });

    const [countryCodeState, setRegionCodeState] = useState(
      parsedPhone?.regionCode as CountryKey | undefined,
    );

    const countryCode = countryCodeState || storedCountryCode;

    const options = useMemo(
      () =>
        COUNTRY_VALUES.map(({ countryCode, callingCode }) => ({
          label: callingCode,
          value: countryCode,
          description: t(`constants.countries.${countryCode}`),
        })).sort(
          (a, b) =>
            parseInt(a.label.substring(1)) - parseInt(b.label.substring(1)),
        ),
      [t],
    );

    useDidUpdate(() => {
      if (countryCodeState && storedCountryCode !== countryCodeState)
        setStoredRegionCode(countryCodeState);
    }, [countryCodeState]);

    if (!countryCode) return null;

    return (
      <Input.Wrapper
        id={id}
        label={label}
        description={description}
        error={error}
        required={required}
        withAsterisk={withAsterisk}
        style={style}
      >
        <Group gap={0} wrap="nowrap">
          <Combobox
            searchable
            allowDeselect={false}
            autoComplete="off"
            styles={{
              root: { flexGrow: 0 },
              input: {
                width: `${
                  (COUNTRIES[countryCode].callingCode.length - 2) * 10 + 69
                }px`,
              },
            }}
            classNames={{ input: styles.callingCodeInput }}
            onChange={(value) => {
              if (value) {
                setRegionCodeState(value as CountryKey);
                inputRef.current?.focus();
              }
            }}
            value={countryCode}
            defaultValue={parsedDefaultPhone?.regionCode}
            data={options}
            disabled={disabled}
          />
          <Input
            ref={mergeRefs([inputRef, ref])}
            id={id}
            type="tel"
            autoComplete={autoComplete ? "tel" : undefined}
            disabled={disabled}
            required={required}
            autoFocus={autoFocus}
            value={
              value
                ? parsedPhone?.number?.national ||
                  parsedPhone?.number?.input ||
                  ""
                : undefined
            }
            defaultValue={
              parsedDefaultPhone?.number?.national ||
              parsedDefaultPhone?.number?.input
            }
            styles={{
              input: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }}
            className={styles.numberInput}
            onChange={(e) => {
              const parsedPhone = parsePhoneNumber(e.target.value, {
                regionCode: countryCode,
              });

              if (onChange)
                onChange(
                  parsedPhone.number?.e164 || parsedPhone.number?.input || "",
                );
              else if (parsedPhone.number?.national)
                e.target.value = parsedPhone.number.national;
            }}
          />
        </Group>
      </Input.Wrapper>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
