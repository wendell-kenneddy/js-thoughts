import { Flex, Spinner } from "@chakra-ui/react";

export function Loading() {
  return (
    <Flex w="90vw" maxW={720} mx="auto" align="center" justify="center">
      <Spinner size="md" my="10" />
    </Flex>
  );
}
