import { useState } from "react";

import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";

import { ReservationInvoiceExtraValues } from "./CreateInvoiceExtraModal";

export const EditInvoiceExtraModal = ({
  currentValues,
  onConfirm,
}: {
  currentValues: ReservationInvoiceExtraValues;
  onConfirm: (updatedValues: ReservationInvoiceExtraValues) => void;
}) => {
  const [values, setValues] = useState({
    name: currentValues.name,
    quantity: currentValues.quantity,
    amount: currentValues.amount,
    unit: currentValues.unit,
    basis: currentValues.basis,
    timing: currentValues.timing,
    vatPercentage: currentValues.vatPercentage,
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
      <Group wrap="nowrap">
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
      </Group>
      <Group wrap="nowrap">
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
      </Group>
      <Group wrap="nowrap">
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
      </Group>
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
        <Button onClick={confirmHandler} fullWidth>
          Save
        </Button>
      </Group>
    </Stack>
  );
};
