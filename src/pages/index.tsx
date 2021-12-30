import { useMemo } from "react";

import Head from "next/head";

import { VStack } from "@chakra-ui/react";

import { useInfiniteQuery } from "react-query";

import Prismic from "@prismicio/client";

import { getPrismicClient } from "../services/getPrismicClient";
import { api } from "../services/api";

import { formatDate } from "../lib/formatDate";
import { calculateReadTime } from "../lib/calculateReadTime";

import { PostCard } from "../components/PostCard";
import { FetchNextPageButton } from "../components/FetchNextPageButton";

interface Post {
  slug: string;
  title: string;
  description: string;
  publicationDate: string;
  readTime: string;
}

interface PostDataPage {
  data: Post[];
  next_page: string | null;
}

interface HomeProps {
  postPagination: PostDataPage[];
}

export default function Home({ postPagination }: HomeProps) {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      "posts",
      async ({ pageParam = null }) => {
        const response = await api.get<PostDataPage>("/api/posts", {
          params: {
            next_page: pageParam,
          },
        });

        return response.data;
      },
      {
        initialData: {
          pages: postPagination,
          pageParams: [],
        },
        getNextPageParam: (lastPage) => lastPage.next_page,
      }
    );

  const formattedResults = useMemo(() => {
    return data?.pages.map((page) => page.data).flat();
  }, [data]);

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
        align="flex-start"
      >
        {formattedResults &&
          formattedResults.map((post) => (
            <PostCard post={post} key={post.slug} />
          ))}

        {hasNextPage && (
          <FetchNextPageButton
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            mt="10"
          />
        )}
      </VStack>
    </>
  );
}

export async function getStaticProps() {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    Prismic.predicates.at("document.type", "post"),
    {
      fetch: ["post.title", "post.description", "post.content"],
      orderings: "[document.first_publication_date desc]",
      pageSize: 5,
    }
  );

  const formattedPosts = postsResponse.results.map((post) => ({
    slug: post.uid,
    title: post.data.title,
    description: post.data.description,
    publicationDate: formatDate(new Date(String(post.first_publication_date))),
    readTime: calculateReadTime(post.data.content),
  }));

  const postPagination = [
    {
      data: formattedPosts,
      next_page: postsResponse.next_page,
    },
  ];

  return {
    props: {
      postPagination,
    },
  };
}
