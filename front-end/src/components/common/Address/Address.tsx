"use client";

import { useCallback, useMemo } from "react";
import { useState } from "react";

import { COUNTRY_VALUES } from "@/constants/countries";
import { useFormContext } from "@/hooks/useFormContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Group, TextInput } from "@mantine/core";
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

  const { values, setValues, errors, register } = useFormContext<{
    street?: string | null;
    houseNumber?: string | null;
    postalCode?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
  }>();

  const street = values.street;
  const houseNumber = values.houseNumber;

  const defaultValue = useMemo(
    () =>
      street && houseNumber
        ? `${street} ${houseNumber}`
        : street ?? houseNumber,
    [street, houseNumber],
  );

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
      if (!option)
        return setValues({
          street: null,
          houseNumber: null,
        });

      if (option.substring(0, 2) !== '{"') {
        const addressArray = option.split(/(\d+.*)/) as string[];
        const street = addressArray.shift()?.trim() ?? null;

        let houseNumber = "";
        if (addressArray.length) houseNumber = addressArray.join("").trim();

        return setValues({ street, houseNumber });
      }

      const selectedAddress = JSON.parse(option);
      const newValues = Object.values(AddressKey).reduce((values, key) => {
        let value = selectedAddress[key];

        if (key === AddressKey.Country)
          value = COUNTRY_VALUES.find(
            (countryObject) => countryObject.isoAlpha3 === value,
          )?.countryCode;

        return {
          ...values,
          [key]: value,
        };
      }, {});

      setValues(newValues);
    },
    [setValues],
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
        error={errors.street}
        // filter={({ options }) => options}
        searchable
        clearable
      />
      <TextInput
        {...register("postalCode")}
        label={t("components.address.postalCode")}
        autoComplete="none"
        disabled={disabled}
      />
      <TextInput
        {...register("city")}
        autoComplete="none"
        label={t("components.address.city")}
        disabled={disabled}
      />
      <TextInput
        {...register("region")}
        autoComplete="none"
        label={t("components.address.region")}
        disabled={disabled}
      />
      <Combobox
        {...register("country")}
        autoComplete="none"
        label={t("components.address.country")}
        data={countryOptions}
        disabled={disabled}
        searchable
        clearable
      />
    </Group>
  );
};
