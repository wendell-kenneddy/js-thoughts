import Link from "next/link";

import { Text, useColorModeValue, VStack } from "@chakra-ui/react";

interface NextPostProps {
  previousPost: { slug: string; title: string };
}

export function PreviousPost({ previousPost }: NextPostProps) {
  return (
    <Link href={"/posts/" + previousPost.slug} passHref>
      <VStack as="a" textAlign="left" align="flex-start">
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight={600}
          color={useColorModeValue("yellow.500", "yellow.200")}
        >
          Post anterior
        </Text>

        <Text
          fontSize={{ base: "xs", md: "md" }}
          color={useColorModeValue("gray.900", "whiteAlpha.700")}
        >
          {previousPost.title}
        </Text>
      </VStack>
    </Link>
  );
}
