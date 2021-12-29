import { Flex } from "@chakra-ui/react";

import { Logo } from "./partials/Logo";
import { ColorModeButton } from "./partials/ColorModeButton";

export function Header() {
  return (
    <Flex
      w="90vw"
      maxW={720}
      mx="auto"
      py="4"
      align="center"
      justify="space-between"
      as="header"
    >
      <Logo />

      <ColorModeButton />
    </Flex>
  );
}
