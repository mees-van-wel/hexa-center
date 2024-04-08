import { useState } from "react";

import { useTranslation } from "@/hooks/useTranslation";
import { Button, Group, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { modals } from "@mantine/modals";

type InvoicePeriodModalProps = {
  minDate: Date;
  maxDate: Date;
  defaultDate?: Date;
  excludeDate: (date: Date) => boolean;
  onCancel?: () => void;
  onConfirm?: (periodStartDate: Date, periodEndDate: Date) => void;
};

export const InvoicePeriodModal = ({
  minDate,
  maxDate,
  defaultDate,
  excludeDate,
  onCancel,
  onConfirm,
}: InvoicePeriodModalProps) => {
  const t = useTranslation();
  const [invoicePeriod, setInvoicePeriod] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const cancelHandler = () => {
    if (onCancel) onCancel();
    modals.closeAll();
  };

  const confirmHandler = () => {
    if (!invoicePeriod[0] || !invoicePeriod[1]) return;

    if (onConfirm) onConfirm(invoicePeriod[0], invoicePeriod[1]);
    modals.closeAll();
  };

  return (
    <Stack align="center">
      <DatePicker
        type="range"
        value={invoicePeriod}
        onChange={setInvoicePeriod}
        excludeDate={excludeDate}
        minDate={minDate}
        maxDate={maxDate}
        defaultDate={defaultDate}
        hideOutsideDates
      />
      <Group justify="space-evenly" w="100%">
        <Button variant="light" onClick={cancelHandler}>
          {t("common.back")}
        </Button>
        <Button
          disabled={!invoicePeriod[0] || !invoicePeriod[1]}
          onClick={confirmHandler}
        >
          {t("entities.reservation.invoicePeriod.create")}
        </Button>
      </Group>
    </Stack>
  );
};
