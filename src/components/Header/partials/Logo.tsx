import Link from "next/link";

import { Heading, Text, useColorModeValue } from "@chakra-ui/react";

export function Logo() {
  const spanColor = useColorModeValue("yellow.500", "yellow.200");

  return (
    <Link href="/" passHref>
      <Heading as="a" lineHeight={0} fontSize={{ base: "lg", md: "2xl" }}>
        <Text as="span" color={spanColor} lineHeight={0}>
          JS
        </Text>
        Thoughts
      </Heading>
    </Link>
  );
}
