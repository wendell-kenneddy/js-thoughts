import dynamic from "next/dynamic";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";

import { Box, Divider, Flex, Heading, Spinner, VStack } from "@chakra-ui/react";

import { RichText } from "prismic-dom";

import Prismic from "@prismicio/client";

import { getPrismicClient } from "../../services/getPrismicClient";

import { formatDate } from "../../lib/formatDate";
import { calculateReadTime } from "../../lib/calculateReadTime";
import { getNextPost } from "../../lib/getNextPost";
import { getPreviousPost } from "../../lib/getPreviousPost";

import { PostCardMetadata } from "../../components/PostCard/partials/PostCardMetadata";

const PostPagination = dynamic<PostPaginationProps>(
  () =>
    import("../../components/PostPagination").then((mod) => mod.PostPagination),
  {
    loading: () => <Spinner size="md" />,
  }
);

import styles from "./post.module.scss";
import { PostPaginationProps } from "../../components/PostPagination";

interface PaginatedPost {
  slug: string;
  title: string;
}

interface PostProps {
  post: {
    title: string;
    description: string;
    content: string;
    publicationDate: string;
    lastEditedDate: string;
    readTime: string;
  };
  nextPost: PaginatedPost | null;
  previousPost: PaginatedPost | null;
}

export default function Post({ post, previousPost, nextPost }: PostProps) {
  // TODO: populate the url related meta tags with the production url
  const pageTitle = `JSThoughts | ${post.title}`;
  const pageDescription = post.description;

  return (
    <>
      <Head>
        <meta name="author" content="Wendell Kenneddy" />
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:site_name" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:locale" content="pt-BR" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <title>{pageTitle}</title>
      </Head>

      <Flex
        as="main"
        w="90vw"
        maxW={720}
        mx="auto"
        mt={{ base: "10", lg: "20" }}
        flexDirection="column"
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

        {(nextPost || previousPost) && (
          <>
            <Divider my="10" />
            <PostPagination nextPost={nextPost} previousPost={previousPost} />
          </>
        )}
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
    fallback: "blocking",
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

  const nextPost = await getNextPost(response.id);
  const previousPost = await getPreviousPost(response.id);

  return {
    props: { post, nextPost, previousPost },
    revalidate: 60 * 60 * 12, // 12 hours
  };
};
