import { useState } from "react";

import { Button, Group, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";

type IssueModalProps = {
  onCancel?: () => void;
  onConfirm?: (date: Date) => void;
};

export const IssueModal = ({ onCancel, onConfirm }: IssueModalProps) => {
  const [issueDate, setIssueDate] = useState(new Date());

  const cancelHandler = () => {
    if (onCancel) onCancel();
    modals.closeAll();
  };

  const confirmHandler = () => {
    if (onConfirm) onConfirm(issueDate);
    modals.closeAll();
  };

  return (
    <Stack>
      <DateInput
        label="Date"
        withAsterisk
        value={issueDate}
        onChange={(date) => {
          if (date) setIssueDate(date);
        }}
      />
      <Group>
        <Button variant="light" onClick={cancelHandler}>
          No
        </Button>
        <Button onClick={confirmHandler}>Yes</Button>
      </Group>
    </Stack>
  );
};