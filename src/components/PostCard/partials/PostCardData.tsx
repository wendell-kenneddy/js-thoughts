import Link from "next/link";

import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

interface PostCardDataProps {
  slug: string;
  title: string;
  description: string;
}

export function PostCardData({ slug, title, description }: PostCardDataProps) {
  return (
    <VStack spacing="1" align="flex-start">
      <Link href={"/posts/" + slug} passHref>
        <Box
          _hover={{
            color: useColorModeValue("yellow.500", "yellow.200"),
          }}
          cursor="pointer"
          transition="color .2s"
        >
          <Heading as="h3" fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}>
            {title}
          </Heading>
        </Box>
      </Link>

      <Text
        fontSize={{ base: "sm", md: "md" }}
        color={useColorModeValue("gray.900", "whiteAlpha.700")}
      >
        {description}
      </Text>
    </VStack>
  );
}
