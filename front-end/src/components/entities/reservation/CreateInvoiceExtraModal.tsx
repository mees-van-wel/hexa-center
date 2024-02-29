import { useMemo, useState } from "react";

import { RouterOutput } from "@back-end/routes/_app";
import {
  Button,
  Divider,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { modals } from "@mantine/modals";

export type ReservationInvoiceExtraValues = {
  name: string;
  quantity: string;
  amount: string;
  unit: "currency";
  basis: "oneTime" | "perNight";
  timing: "throughout" | "end";
  vatPercentage: string;
};

type CreateInvoiceExtraModalProps = {
  templates: RouterOutput["invoiceExtra"]["list"];
  onConfirm: (
    templateId: number | null,
    overrides: ReservationInvoiceExtraValues,
  ) => void;
};

export const CreateInvoiceExtraModal = ({
  templates,
  onConfirm,
}: CreateInvoiceExtraModalProps) => {
  const [templateId, setTemplateId] = useState<number | null>(null);

  const template = useMemo(
    () =>
      templateId ? templates.find(({ id }) => id === templateId) : undefined,
    [templateId, templates],
  );

  const [values, setValues] = useState<ReservationInvoiceExtraValues>({
    name: "",
    quantity: "1",
    amount: "",
    unit: "currency",
    basis: "oneTime",
    timing: "end",
    vatPercentage: "21",
  });

  useDidUpdate(() => {
    if (!template) return;

    const { name, quantity, amount, unit, vatPercentage } = template;

    setValues({
      ...values,
      name,
      quantity,
      amount,
      unit,
      vatPercentage,
    });
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
        <NumberInput
          label="Amount"
          value={values.amount}
          onChange={(amount) => {
            changeHandler({ amount: amount.toString() });
          }}
          decimalScale={2}
          decimalSeparator=","
          fixedDecimalScale
          hideControls
          withAsterisk
        />
        <Select
          label="Unit"
          data={["currency"]}
          value={values.unit}
          onChange={(unit) => {
            if (unit) changeHandler({ unit });
          }}
          allowDeselect={false}
          withAsterisk
        />
        <Select
          label="Basis"
          data={["oneTime", "perNight"]}
          value={values.basis}
          onChange={(basis) => {
            if (basis) changeHandler({ basis });
          }}
          allowDeselect={false}
          withAsterisk
        />
        <Select
          label="Timing"
          data={["end", "throughout"]}
          value={values.timing}
          onChange={(timing) => {
            if (timing) changeHandler({ timing });
          }}
          allowDeselect={false}
          withAsterisk
        />
      </SimpleGrid>
      <NumberInput
        label="VAT Percentage"
        value={values.vatPercentage}
        onChange={(vatPercentage) => {
          changeHandler({ vatPercentage: vatPercentage.toString() });
        }}
        decimalScale={2}
        decimalSeparator=","
        fixedDecimalScale
        hideControls
        withAsterisk
        rightSection="%"
      />
      <Group justify="space-evenly" w="100%" wrap="nowrap">
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
          disabled={!values.name || !values.amount || !values.vatPercentage}
          onClick={confirmHandler}
          fullWidth
        >
          Apply
        </Button>
      </Group>
    </Stack>
  );
};
