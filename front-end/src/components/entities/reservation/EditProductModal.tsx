import { useState } from "react";

import { useTranslation } from "@/hooks/useTranslation";
import { type RouterOutput } from "@/utils/trpc";
import {
  Button,
  ButtonGroup,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";

import { Cycle, ReservationProductValues } from "./AddProductModal";

type EditProductModalProps = {
  ledgerAccounts: RouterOutput["ledgerAccount"]["list"];
  currentValues: ReservationProductValues;
  onConfirm: (updatedValues: ReservationProductValues) => void;
};

export const EditProductModal = ({
  ledgerAccounts,
  currentValues,
  onConfirm,
}: EditProductModalProps) => {
  const t = useTranslation();
  const [values, setValues] = useState({
    name: currentValues.name,
    price: currentValues.price,
    vatRate: currentValues.vatRate,
    quantity: currentValues.quantity,
    revenueAccountId: currentValues.revenueAccountId,
    cycle: currentValues.cycle,
  });

  const changeHandler = (newValues: Partial<typeof currentValues>) => {
    setValues({ ...values, ...newValues });
  };

  const confirmHandler = () => {
    onConfirm(values);
    modals.closeAll();
  };

  return (
    <Stack>
      <SimpleGrid cols={2} verticalSpacing="xs">
        <TextInput
          label={t("common.name")}
          value={values.name}
          onChange={(event) => {
            changeHandler({ name: event.target.value });
          }}
          withAsterisk
        />
        <NumberInput
          label={t("entities.product.price")}
          value={values.price}
          onChange={(price) => {
            changeHandler({ price: price.toString() });
          }}
          leftSection="€"
          decimalScale={2}
          decimalSeparator=","
          fixedDecimalScale
          hideControls
          withAsterisk
        />
        <NumberInput
          label={t("entities.product.vatRate")}
          value={!values.vatRate ? "" : values.vatRate}
          onChange={(vatRate) => {
            changeHandler({
              vatRate: vatRate === "" ? null : vatRate.toString(),
            });
          }}
          decimalScale={2}
          decimalSeparator=","
          fixedDecimalScale
          hideControls
          rightSection="%"
        />
        <NumberInput
          label={t("entities.product.quantity")}
          value={values.quantity}
          onChange={(quantity) => {
            changeHandler({ quantity: quantity.toString() });
          }}
          decimalScale={2}
          decimalSeparator=","
          fixedDecimalScale
          hideControls
          withAsterisk
        />
        <Select
          label={t("entities.product.revenueAccount")}
          data={ledgerAccounts.map(({ id, name }) => ({
            label: name,
            value: id.toString(),
          }))}
          value={values.revenueAccountId?.toString()}
          onChange={(revenueAccountId) => {
            if (!revenueAccountId) return;
            changeHandler({ revenueAccountId: parseInt(revenueAccountId) });
          }}
          allowDeselect={false}
          withAsterisk
        />
        <Select
          label={t("entities.product.cycle.name")}
          data={[
            {
              value: "oneTimeOnNext",
              label: t("entities.product.cycle.oneTimeOnNext"),
            },
            {
              value: "oneTimeOnEnd",
              label: t("entities.product.cycle.oneTimeOnEnd"),
            },
            {
              value: "perNightThroughout",
              label: t("entities.product.cycle.perNightThroughout"),
            },
            {
              value: "perNightOnEnd",
              label: t("entities.product.cycle.perNightOnEnd"),
            },
          ]}
          value={values.cycle}
          onChange={(cycle) => {
            if (!cycle) return;
            changeHandler({ cycle: cycle as Cycle });
          }}
          allowDeselect={false}
          withAsterisk
        />
      </SimpleGrid>
      <ButtonGroup>
        <Button
          variant="light"
          onClick={() => {
            modals.closeAll();
          }}
          fullWidth
        >
          {t("common.back")}
        </Button>
        <Button onClick={confirmHandler} fullWidth>
          {t("common.save")}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
