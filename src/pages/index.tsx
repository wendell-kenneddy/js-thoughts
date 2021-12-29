import Head from "next/head";

import { Flex } from "@chakra-ui/react";

import { Header } from "../components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Posts sobre o ecossistema Javascript."
        />
        <title>JSThoughts</title>
      </Head>

      <Header />

      <Flex as="main" w="90vw" maxW={720} flexDir="column" mx="auto" mt="10">
        <h1>Content</h1>
      </Flex>
    </>
  );
}
