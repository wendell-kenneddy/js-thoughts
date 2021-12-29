import {
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  StackProps,
} from "@chakra-ui/react";

import { FiCalendar, FiClock } from "react-icons/fi";

interface PostCardMetadataProps extends StackProps {
  publcationDate: string;
  readTime: string;
}

export function PostCardMetadata({
  publcationDate,
  readTime,
  ...rest
}: PostCardMetadataProps) {
  return (
    <HStack
      color={useColorModeValue("gray.900", "whiteAlpha.700")}
      spacing="4"
      fontSize={{ base: "sm", md: "md" }}
      {...rest}
    >
      <Flex align="center">
        <Icon as={FiCalendar} mr="2" />
        {publcationDate}
      </Flex>

      <Flex align="center">
        <Icon as={FiClock} mr="2" />
        {readTime}
      </Flex>
    </HStack>
  );
}
