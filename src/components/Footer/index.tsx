import Link from "next/link";

import {
  Flex,
  Link as ChakraLink,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export function Footer() {
  return (
    <Flex
      as="footer"
      w="90vw"
      maxW={720}
      mx="auto"
      my="6"
      align="center"
      justify="center"
    >
      <Text
        fontSize={{ base: "xs", md: "sm", lg: "md" }}
        color={useColorModeValue("gray.900", "whiteAlpha.700")}
      >
        Feito com 💛 por
        <Link href="https://github.com/wendell-kenneddy" passHref>
          <ChakraLink
            ml="1"
            isExternal
            color={useColorModeValue("yellow.500", "yellow.200")}
          >
            Wendell Kenneddy
          </ChakraLink>
        </Link>
      </Text>
    </Flex>
  );
}
