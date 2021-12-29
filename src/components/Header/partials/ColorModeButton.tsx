import { IconButton, useBreakpointValue, useColorMode } from "@chakra-ui/react";

import { FaMoon, FaSun } from "react-icons/fa";

export function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  });

  return (
    <IconButton
      aria-label="Mudar tema"
      colorScheme="yellow"
      fontSize={{ base: "sm", md: "md" }}
      size={isWideVersion ? "md" : "sm"}
      icon={colorMode === "dark" ? <FaMoon /> : <FaSun />}
      onClick={() => toggleColorMode()}
    />
  );
}
