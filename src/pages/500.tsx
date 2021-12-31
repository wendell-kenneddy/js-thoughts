import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import {
  Box,
  Button,
  Flex,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";

export default function ServerError() {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  });

  return (
    <>
      <Head>
        <meta name="description" content="Erro interno no servidor" />
        <title>Erro interno no servidor</title>
      </Head>

      <Flex
        as="main"
        w="90vw"
        maxW={720}
        mx="auto"
        my="10"
        align="center"
        justify="center"
        flexDirection="column"
      >
        <Heading fontSize={{ base: "lg", md: "xl", lg: "2xl" }}>
          Oops... Ocorreu um erro no servidor :/
        </Heading>

        <Box
          position="relative"
          my="4"
          w={{ base: 200, md: 300 }}
          h={{ base: 200, md: 300 }}
        >
          <Image
            src="/500.svg"
            alt="Error interno no servidor"
            layout="fill"
            objectPosition="center"
            priority
          />
        </Box>

        <Link href="/" passHref>
          <Button
            size={isWideVersion ? "md" : "sm"}
            as="a"
            variant="outline"
            colorScheme="yellow"
          >
            Voltar para a página principal
          </Button>
        </Link>
      </Flex>
    </>
  );
}
