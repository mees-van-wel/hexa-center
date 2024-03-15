import { useMemo, useState } from "react";

import { RouterOutput } from "@back-end/routes/_app";
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
import { IconCurrencyEuro } from "@tabler/icons-react";

export type ReservationProductValues = {
  name: string;
  price: string;
  vatRate: string;
  quantity: string;
  cycle:
    | "oneTimeOnNext"
    | "oneTimeOnEnd"
    | "perNightThroughout"
    | "perNightOnEnd";
};

type AddProductModalProps = {
  templates: RouterOutput["product"]["list"];
  onConfirm: (
    templateId: number | null,
    overrides: ReservationProductValues,
  ) => void;
};

export const AddProductModal = ({
  templates,
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
    cycle: "",
  });

  useDidUpdate(() => {
    if (!template) return;

    setValues({
      ...values,
      name: template.name,
      price: template.price,
      vatRate: template.vatRate,
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
          label="Price"
          value={values.price}
          onChange={(price) => {
            changeHandler({ price: price.toString() });
          }}
          leftSection={<IconCurrencyEuro size="1rem" />}
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
        <Button
          disabled={
            !values.name || !values.price || !values.vatRate || !values.cycle
          }
          onClick={confirmHandler}
          fullWidth
        >
          Apply
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
