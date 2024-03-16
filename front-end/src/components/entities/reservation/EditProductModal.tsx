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

import { ReservationProductValues } from "./AddProductModal";

type EditProductModalProps = {
  currentValues: ReservationProductValues;
  onConfirm: (updatedValues: ReservationProductValues) => void;
};

export const EditProductModal = ({
  currentValues,
  onConfirm,
}: EditProductModalProps) => {
  const [values, setValues] = useState({
    name: currentValues.name,
    price: currentValues.price,
    vatRate: currentValues.vatRate,
    quantity: currentValues.quantity,
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
      <TextInput
        label="Name"
        value={values.name}
        onChange={(event) => {
          changeHandler({ name: event.target.value });
        }}
        withAsterisk
      />
      <SimpleGrid cols={2} verticalSpacing="xs">
        <NumberInput
          label="Price"
          value={values.price}
          onChange={(price) => {
            changeHandler({ price: price.toString() });
          }}
          decimalScale={2}
          decimalSeparator=","
          fixedDecimalScale
          hideControls
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
          label="Cycle"
          data={[
            "oneTimeOnNext",
            "oneTimeOnEnd",
            "perNightThroughout",
            "perNightOnEnd",
          ]}
          value={values.cycle}
          onChange={(cycle) => {
            if (cycle) changeHandler({ cycle });
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
        <Button onClick={confirmHandler} fullWidth>
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
