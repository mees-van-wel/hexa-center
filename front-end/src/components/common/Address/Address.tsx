"use client";

import { useCallback, useMemo } from "react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { COUNTRY_VALUES } from "@/constants/countries";
import { useTranslation } from "@/hooks/useTranslation";
import { Group, Select, Stack, TextInput } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";

import { Combobox } from "../Combobox";

const AddressKeys = {
  AddressLineOne: "addressLineOne",
  PostalCode: "postalCode",
  City: "city",
  Region: "region",
  Country: "country",
} as const;

type AutocompleteResponse = {
  items: {
    resultType: string;
    address: {
      street: string;
      houseNumber: string;
      postalCode: string;
      city: string;
      state: string;
      countryName: string;
      countryCode: string;
    };
  }[];
};

type AddressProps = {
  disabled?: boolean;
  required?: boolean;
  keyOverrides?: Record<
    (typeof AddressKeys)[keyof typeof AddressKeys] | "addressLineTwo",
    string
  >;
};

export const Address = ({ disabled, required, keyOverrides }: AddressProps) => {
  const t = useTranslation();

  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const addressLineOneKey =
    keyOverrides?.addressLineOne || AddressKeys.AddressLineOne;
  const addressLineTwoKey = keyOverrides?.addressLineTwo || "addressLineTwo";
  const postalCodeKey = keyOverrides?.postalCode || AddressKeys.PostalCode;
  const cityKey = keyOverrides?.city || AddressKeys.City;
  const regionKey = keyOverrides?.region || AddressKeys.Region;
  const countryKey = keyOverrides?.country || AddressKeys.Country;

  const addressLineOne = watch(addressLineOneKey);

  const [searchValue, setSearchValue] = useState(addressLineOne);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    addressLineOne
      ? [
          {
            label: addressLineOne,
            value: addressLineOne,
          },
        ]
      : [],
  );

  useDidUpdate(() => {
    (async () => {
      if (!searchValue || searchValue?.split(" ").length <= 1)
        return setOptions(
          searchValue?.length
            ? [{ value: searchValue, label: searchValue }]
            : addressLineOne
              ? [
                  {
                    label: addressLineOne,
                    value: addressLineOne,
                  },
                ]
              : [],
        );

      const params = new URLSearchParams({
        apiKey: process.env.NEXT_PUBLIC_HERE_API_KEY!,
        q: searchValue.replaceAll(" ", "+"),
      });

      const res = await fetch(
        `https://autocomplete.search.hereapi.com/v1/autocomplete?${params}`,
      );

      const { items }: AutocompleteResponse = await res.json();

      const options = items
        .filter(
          ({ resultType }: { resultType: string }) =>
            resultType === "houseNumber",
        )
        .map(({ address }) => {
          const {
            street,
            houseNumber,
            postalCode,
            city,
            state,
            countryName,
            countryCode,
          } = address;
          return {
            label: `${street} ${houseNumber}`,
            description: `${city} - ${state || postalCode} - ${countryName}`,
            value: JSON.stringify({
              [addressLineOneKey]: `${street} ${houseNumber}`,
              [postalCodeKey]: postalCode,
              [cityKey]: city,
              [regionKey]: state,
              [countryKey]: countryCode,
            }),
          };
        });

      setOptions([...options, { value: searchValue, label: searchValue }]);
    })();
  }, [searchValue]);

  const selectHandler = useCallback(
    (option: string | null) => {
      if (!option) {
        setValue(addressLineOneKey, "", {
          shouldDirty: true,
          shouldTouch: true,
        });
        return;
      }

      if (option.substring(0, 2) !== '{"') {
        setValue(addressLineOneKey, option, {
          shouldDirty: true,
          shouldTouch: true,
        });
        return;
      }

      const selectedAddress = JSON.parse(option);

      Object.values(AddressKeys).forEach((key) => {
        // @ts-ignore
        key = keyOverrides?.[key] || key;
        let value = selectedAddress[key];

        if (key === countryKey)
          value = COUNTRY_VALUES.find(
            (countryObject) => countryObject.isoAlpha3 === value,
          )?.countryCode;

        setValue(key, value || "", { shouldDirty: true, shouldTouch: true });
      });
    },
    [setValue],
  );

  const countryOptions = useMemo(
    () =>
      COUNTRY_VALUES.map((country) => ({
        value: country.countryCode,
        label: t(`constants.countries.${country.countryCode}`),
      })),
    [t],
  );

  return (
    <Group grow>
      <Stack gap="xs">
        <Combobox
          autoComplete="none"
          label={t("components.address.addressLineOne")}
          onSearchChange={setSearchValue}
          searchValue={searchValue || addressLineOne || ""}
          data={options}
          onChange={selectHandler}
          defaultValue={addressLineOne}
          disabled={disabled}
          // positionDependencies={[options]}
          error={errors[addressLineOneKey]?.message?.toString()}
          // filter={({ options }) => options}
          searchable
          clearable
          required={required}
        />
        <TextInput
          {...register(addressLineTwoKey)}
          label={t("components.address.addressLineTwo")}
          error={errors[addressLineTwoKey]?.message?.toString()}
          autoComplete="none"
          disabled={disabled}
        />
      </Stack>
      <Stack gap="xs">
        <TextInput
          {...register(postalCodeKey)}
          label={t("components.address.postalCode")}
          error={errors[postalCodeKey]?.message?.toString()}
          autoComplete="none"
          disabled={disabled}
        />
        <TextInput
          {...register(regionKey)}
          autoComplete="none"
          label={t("components.address.region")}
          error={errors[regionKey]?.message?.toString()}
          disabled={disabled}
        />
      </Stack>
      <Stack gap="xs">
        <TextInput
          {...register(cityKey)}
          autoComplete="none"
          label={t("components.address.city")}
          error={errors[cityKey]?.message?.toString()}
          disabled={disabled}
          required={required}
        />
        <Controller
          name={countryKey}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              error={error?.message}
              autoComplete="none"
              label={t("components.address.country")}
              data={countryOptions}
              disabled={disabled}
              required={required}
              searchable
              clearable
            />
          )}
        />
      </Stack>
    </Group>
  );
};
