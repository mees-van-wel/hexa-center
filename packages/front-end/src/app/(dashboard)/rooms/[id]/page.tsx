"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Button, Paper, Stack, TextInput } from "@mantine/core";

export default function Room() {
    const t = useTranslation();

    return (
        <Paper p="md">
            <Button>
                {t("generic.create")}
            </Button>
            <Button variant="light" color="red">
                {t("generic.create")}
            </Button>
            <Stack>
                <TextInput label="Name" />
                <TextInput label="Price per night" />
            </Stack>
        </Paper>
    );
}
