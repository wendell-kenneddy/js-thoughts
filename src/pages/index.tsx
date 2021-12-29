import Head from "next/head";

import { VStack } from "@chakra-ui/react";

import { PostCard } from "../components/PostCard";

const FAKE_POSTS = [
  {
    slug: "recriando-map-reduce-e-post",
    title: "Recriando map, reduce e post",
    description: "Some super fake description",
    publicationDate: "08 dez 2021",
    readTime: "8min",
  },
  {
    slug: "testes-com-jest",
    title: "Testes com Jest",
    description: "Some super fake description",
    publicationDate: "16 dez 2021",
    readTime: "16min",
  },
  {
    slug: "migrando-class-components-para-functional-components",
    title: "Migrando Class Components para Functional Components",
    description: "Some super fake description",
    publicationDate: "30 dez 2021",
    readTime: "32min",
  },
  {
    slug: "criando-um-blog-com-nextjs-e-prismic",
    title: "Criando um blog com NextJS e Prismic",
    description: "Some super fake description",
    publicationDate: "30 dez 2021",
    readTime: "64min",
  },
];

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

      <VStack
        as="main"
        w="90vw"
        maxW={720}
        mx="auto"
        mt={{ base: "10", md: "20" }}
        spacing="10"
      >
        {FAKE_POSTS.map((post) => (
          <PostCard post={post} key={post.slug} />
        ))}
      </VStack>
    </>
  );
}
