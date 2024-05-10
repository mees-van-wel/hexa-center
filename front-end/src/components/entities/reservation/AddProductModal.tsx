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
import { useMemo, useState } from "react";

import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";

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
  const t = useTranslation();

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
    // @ts-ignore Fix this
    revenueAccountId: null,
    // @ts-ignore Fix this
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
        label={t("common.useTemplate")}
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
      <Divider label={t("common.values")} />
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
        <Button
          disabled={!values.name || !values.price || !values.cycle}
          onClick={confirmHandler}
          fullWidth
        >
          {t("common.apply")}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
