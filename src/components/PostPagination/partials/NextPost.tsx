import Link from "next/link";

import { Text, useColorModeValue, VStack } from "@chakra-ui/react";

interface NextPostProps {
  nextPost: { slug: string; title: string };
}

export function NextPost({ nextPost }: NextPostProps) {
  return (
    <Link href={"/posts/" + nextPost.slug} passHref>
      <VStack as="a" textAlign="right" align="flex-end">
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight={600}
          color={useColorModeValue("yellow.500", "yellow.200")}
        >
          Próximo post
        </Text>

        <Text
          fontSize={{ base: "xs", md: "md" }}
          color={useColorModeValue("gray.900", "whiteAlpha.700")}
        >
          {nextPost.title}
        </Text>
      </VStack>
    </Link>
  );
}
