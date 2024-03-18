import { useMemo, useState } from "react";

import { RouterOutput } from "@/utils/trpc";
import {
  Button,
  ButtonGroup,
  Divider,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { modals } from "@mantine/modals";

export type Cycle =
  | "oneTimeOnNext"
  | "oneTimeOnEnd"
  | "perNightThroughout"
  | "perNightOnEnd";

export type ReservationProductValues = {
  name: string;
  price: string;
  vatRate: string | null;
  quantity: string;
  cycle: Cycle;
  revenueAccountId: number;
};

type AddProductModalProps = {
  templates: RouterOutput["product"]["list"];
  ledgerAccounts: RouterOutput["ledgerAccount"]["list"];
  onConfirm: (
    templateId: number | null,
    overrides: ReservationProductValues,
  ) => void;
};

export const AddProductModal = ({
  templates,
  ledgerAccounts,
  onConfirm,
}: AddProductModalProps) => {
  const [templateId, setTemplateId] = useState<number | null>(null);

  const template = useMemo(
    () =>
      templateId ? templates.find(({ id }) => id === templateId) : undefined,
    [templateId, templates],
  );

  const [values, setValues] = useState<ReservationProductValues>({
    name: "",
    price: "",
    vatRate: "21",
    quantity: "1",
    revenueAccountId: null,
    cycle: null,
  });

  useDidUpdate(() => {
    if (!template) return;

    setValues((values) => ({
      ...values,
      name: template.name,
      price: template.price,
      vatRate: template.vatRate,
      revenueAccountId: template.revenueAccountId,
    }));
  }, [template]);

  const changeHandler = (newValues: Partial<typeof values>) => {
    setValues({ ...values, ...newValues });
  };

  const confirmHandler = () => {
    onConfirm(templateId, values);
    modals.closeAll();
  };

  return (
    <Stack>
      <Select
        label="Use template"
        value={templateId?.toString() || null}
        onChange={(value) => {
          setTemplateId(value ? parseInt(value) : null);
        }}
        data={templates.map(({ id, name }) => ({
          value: id.toString(),
          label: name,
        }))}
        searchable
        clearable
      />
      <Divider label="Values" />
      <SimpleGrid cols={2} verticalSpacing="xs">
        <TextInput
          label="Name"
          value={values.name}
          onChange={(event) => {
            changeHandler({ name: event.target.value });
          }}
          withAsterisk
        />
        <NumberInput
          label="Price"
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
          label="VAT Rate"
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
          label="Quantity"
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
          label="Revenue account"
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
          label="Cycle"
          data={[
            {
              value: "oneTimeOnNext",
              label: "One-Time - On Next Invoice",
            },
            {
              value: "oneTimeOnEnd",
              label: "One-Time - On Final Invoice",
            },
            {
              value: "perNightThroughout",
              label: "Per Night - On Every Invoice",
            },
            {
              value: "perNightOnEnd",
              label: "Per Night - On Final Invoice",
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
          Back
        </Button>
        <Button
          disabled={!values.name || !values.price || !values.cycle}
          onClick={confirmHandler}
          fullWidth
        >
          Apply
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
