"use client";

import { useMemo, useRef, useState } from "react";
import { parsePhoneNumber } from "awesome-phonenumber";
import { useLocalStorage, useId, useDidUpdate } from "@mantine/hooks";
import { Group, Select } from "@mantine/core";
import { Input } from "@mantine/core";
import { COUNTRIES, COUNTRY_VALUES, CountryKey } from "@/constants/countries";
import styles from "./PhoneInput.module.scss";

interface PhoneInputProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => any;
  disabled?: boolean;
  autoComplete?: boolean;
  autoFocus?: boolean;
  withAsterisk?: boolean;
}

// TODO Fix console error Attempted import error: 'parsePhoneNumber' is not exported from 'awesome-phonenumber' (imported as 'parsePhoneNumber').
// TODO Add country as description to select options
export const PhoneInput = ({
  label,
  description,
  error,
  required,
  value,
  onChange,
  disabled,
  autoFocus,
  withAsterisk,
  autoComplete,
}: PhoneInputProps) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const parsedPhoneNumber = useMemo(
    () => (value ? parsePhoneNumber(value) : undefined),
    [value]
  );
  const [storedCountryCode, setStoredRegionCode] = useLocalStorage<CountryKey>({
    key: "phoneInput.countryCode",
  });

  const [countryCodeState, setRegionCodeState] = useState(
    parsedPhoneNumber?.regionCode as CountryKey | undefined
  );

  const countryCode = countryCodeState || storedCountryCode;

  const options = useMemo(
    () =>
      COUNTRY_VALUES.map(({ countryCode, callingCode }) => ({
        label: callingCode,
        value: countryCode,
      })),
    []
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
    >
      <Group gap={0} wrap="nowrap">
        <Select
          searchable
          allowDeselect={false}
          autoComplete="off"
          styles={{
            input: {
              width: `${
                (COUNTRIES[countryCode].callingCode.length - 2) * 10 + 69
              }px`,
            },
          }}
          classNames={{
            input: styles.callingCodeInput,
          }}
          onChange={(value) => {
            if (value) {
              setRegionCodeState(value as CountryKey);
              inputRef.current?.focus();
            }
          }}
          value={countryCode}
          data={options}
          disabled={disabled}
        />
        <Input
          ref={inputRef}
          id={id}
          type="tel"
          autoComplete={autoComplete ? "tel" : undefined}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          value={
            value
              ? parsedPhoneNumber?.number?.national ||
                parsedPhoneNumber?.number?.input ||
                ""
              : undefined
          }
          styles={{
            input: {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          }}
          className={styles.numberInput}
          onChange={(e) => {
            const parsedPhoneNumber = parsePhoneNumber(e.target.value, {
              regionCode: countryCode,
            });

            if (onChange)
              onChange(
                parsedPhoneNumber.number?.e164 ||
                  parsedPhoneNumber.number?.input ||
                  ""
              );
            else if (parsedPhoneNumber.number?.national)
              e.target.value = parsedPhoneNumber.number.national;
          }}
        />
      </Group>
    </Input.Wrapper>
  );
};
