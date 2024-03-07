import { useState } from "react";

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
    cycle: currentValues.cycle,
    vatRate: currentValues.vatRate,
  });

  const changeHandler = (newValues: Partial<typeof currentValues>) => {
    setValues({ ...values, ...newValues });
  };

  const confirmHandler = () => {
    onConfirm(values);
    modals.closeAll();
  };

  return (
    <Stack gap="xl">
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
          label="Cycle"
          data={["oneTimeOnEnd", "perNightThroughout", "perNightOnEnd"]}
          value={values.cycle}
          onChange={(cycle) => {
            if (cycle) changeHandler({ cycle });
          }}
          allowDeselect={false}
          withAsterisk
        />
        <NumberInput
          label="VAT Rate"
          value={values.vatRate}
          onChange={(vatRate) => {
            changeHandler({ vatRate: vatRate.toString() });
          }}
          decimalScale={2}
          decimalSeparator=","
          fixedDecimalScale
          hideControls
          withAsterisk
          rightSection="%"
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
        <Button onClick={confirmHandler} fullWidth>
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
