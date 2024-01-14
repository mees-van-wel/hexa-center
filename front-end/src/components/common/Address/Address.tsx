"use client";

import { useCallback, useMemo } from "react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { COUNTRY_VALUES } from "@/constants/countries";
import { useTranslation } from "@/hooks/useTranslation";
import { Group, Select, TextInput } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";

import { Combobox } from "../Combobox";

enum AddressKey {
  Street = "street",
  HouseNumber = "houseNumber",
  PostalCode = "postalCode",
  City = "city",
  Region = "region",
  Country = "country",
}

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
};

export const Address = ({ disabled }: AddressProps) => {
  const t = useTranslation();

  const {
    register,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<{
    street?: string | null;
    houseNumber?: string | null;
    postalCode?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
  }>();

  const defaultValue = useMemo(() => {
    const street = getValues("street");
    const houseNumber = getValues("houseNumber");

    return street && houseNumber
      ? `${street} ${houseNumber}`
      : street ?? houseNumber;
  }, [getValues]);

  const [searchValue, setSearchValue] = useState(defaultValue);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    defaultValue
      ? [
          {
            label: defaultValue,
            value: defaultValue,
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
            : [],
        );

      const params = new URLSearchParams({
        apiKey: "Q3oVSE4h4paphYezCmG4ULnFSnILGHxNBWksauiT6AQ",
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
              street,
              houseNumber,
              postalCode,
              city,
              region: state,
              country: countryCode,
            }),
          };
        });

      setOptions([...options, { value: searchValue, label: searchValue }]);
    })();
  }, [searchValue]);

  const selectHandler = useCallback(
    (option: string | null) => {
      if (!option) {
        setValue("street", null, { shouldDirty: true, shouldTouch: true });
        setValue("houseNumber", null, { shouldDirty: true, shouldTouch: true });
        return;
      }

      if (option.substring(0, 2) !== '{"') {
        const addressArray = option.split(/(\d+.*)/) as string[];
        const street = addressArray.shift()?.trim() ?? null;

        let houseNumber = "";
        if (addressArray.length) houseNumber = addressArray.join("").trim();

        setValue("street", street, { shouldDirty: true, shouldTouch: true });
        setValue("houseNumber", houseNumber, {
          shouldDirty: true,
          shouldTouch: true,
        });
        return;
      }

      const selectedAddress = JSON.parse(option);

      Object.values(AddressKey).forEach((key) => {
        let value = selectedAddress[key];

        if (key === AddressKey.Country)
          value = COUNTRY_VALUES.find(
            (countryObject) => countryObject.isoAlpha3 === value,
          )?.countryCode;

        setValue(key, value, { shouldDirty: true, shouldTouch: true });
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
      <Combobox
        autoComplete="none"
        label={t("components.address.streetAndHouseNumber")}
        onSearchChange={setSearchValue}
        searchValue={searchValue || ""}
        data={options}
        onChange={selectHandler}
        defaultValue={defaultValue}
        disabled={disabled}
        // positionDependencies={[options]}
        error={errors.street?.message || errors.houseNumber?.message}
        // filter={({ options }) => options}
        searchable
        clearable
      />
      <TextInput
        {...register("postalCode")}
        label={t("components.address.postalCode")}
        error={errors.postalCode?.message}
        autoComplete="none"
        disabled={disabled}
      />
      <TextInput
        {...register("city")}
        autoComplete="none"
        label={t("components.address.city")}
        error={errors.city?.message}
        disabled={disabled}
      />
      <TextInput
        {...register("region")}
        autoComplete="none"
        label={t("components.address.region")}
        error={errors.region?.message}
        disabled={disabled}
      />
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Select
            {...field}
            error={error?.message}
            autoComplete="none"
            label={t("components.address.country")}
            data={countryOptions}
            disabled={disabled}
            searchable
            clearable
          />
        )}
      />
    </Group>
  );
};
