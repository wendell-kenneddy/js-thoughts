import {
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  StackProps,
  Text,
} from "@chakra-ui/react";

import { FiCalendar, FiClock, FiEdit3 } from "react-icons/fi";

interface PostCardMetadataProps extends StackProps {
  publcationDate: string;
  lastEditedDate?: string;
  readTime: string;
}

export function PostCardMetadata({
  publcationDate,
  lastEditedDate,
  readTime,
  ...rest
}: PostCardMetadataProps) {
  return (
    <HStack
      color={useColorModeValue("gray.900", "whiteAlpha.700")}
      spacing="4"
      fontSize={{ base: "xs", md: "md" }}
      flexWrap="wrap"
      {...rest}
    >
      <Flex align="center">
        <Icon as={FiCalendar} mr="2" />
        {publcationDate}
      </Flex>

      {lastEditedDate && lastEditedDate !== publcationDate && (
        <Flex align="center">
          <Icon as={FiEdit3} mr="2" />
          {lastEditedDate}
        </Flex>
      )}

      <Flex align="center">
        <Icon as={FiClock} mr="2" />
        {readTime}
      </Flex>
    </HStack>
  );
}
