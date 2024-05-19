import { Flex, Loader, Paper } from "@mantine/core";

export const Loading = () => (
  <Flex
    gap="md"
    justify="center"
    align="center"
    direction="row"
    wrap="wrap"
    component={Paper}
    p="md"
  >
    <Loader />
  </Flex>
);
