import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { Box, Flex, Heading, VStack } from "@chakra-ui/react";

import { RichText } from "prismic-dom";

import Prismic from "@prismicio/client";

import { getPrismicClient } from "../../services/getPrismicClient";

import { formatDate } from "../../lib/formatDate";
import { calculateReadTime } from "../../lib/calculateReadTime";

import { PostCardMetadata } from "../../components/PostCard/partials/PostCardMetadata";
import { Loading } from "../../components/Loading";

import styles from "./post.module.scss";

interface PostProps {
  post: {
    title: string;
    description: string;
    content: string;
    publicationDate: string;
    lastEditedDate: string;
    readTime: string;
  };
}

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta name="author" content="Wendell Kenneddy" />
        <meta name="description" content={post.description} />
        <title>JSThoughts | {post.title}</title>
      </Head>

      <Flex
        as="main"
        w="90vw"
        maxW={720}
        mx="auto"
        mt={{ base: "10", lg: "20" }}
      >
        <article role="article">
          <VStack as="header" align="flex-start" spacing="2">
            <Heading fontSize={{ base: "3xl", lg: "4xl" }}>
              {post.title}
            </Heading>

            <PostCardMetadata
              readTime={post.readTime}
              publcationDate={post.publicationDate}
              lastEditedDate={post.lastEditedDate}
            />
          </VStack>

          <Box
            w="100%"
            maxW="100%"
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
            mt="10"
          />
        </article>
      </Flex>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  // Fetch the last 100 posts
  const postsResponse = await prismic.query(
    Prismic.predicates.at("document.type", "post"),
    {
      orderings: "[document.first_publication_date desc]",
      pageSize: 100,
    }
  );

  const paths = postsResponse.results.map((post) => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID("post", String(slug), {});

  const post = {
    title: response.data.title,
    description: response.data.description,
    content: RichText.asHtml(response.data.content),
    publicationDate: formatDate(
      new Date(String(response.first_publication_date))
    ),
    lastEditedDate: formatDate(
      new Date(String(response.last_publication_date))
    ),
    readTime: calculateReadTime(response.data.content),
  };

  return {
    props: { post },
    revalidate: 60 * 60 * 12, // 12 hours
  };
};
