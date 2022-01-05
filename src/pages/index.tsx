import { useMemo } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";

import { Spinner, VStack } from "@chakra-ui/react";

import { useInfiniteQuery } from "react-query";

import Prismic from "@prismicio/client";

import { getPrismicClient } from "../services/getPrismicClient";
import { api } from "../services/api";

import { formatDate } from "../lib/formatDate";
import { calculateReadTime } from "../lib/calculateReadTime";

import { PostCard } from "../components/PostCard";
import { FetchNextPageButtonProps } from "../components/FetchNextPageButton";

const FetchNextPageButton = dynamic<FetchNextPageButtonProps>(
  () =>
    import("../components/FetchNextPageButton").then(
      (mod) => mod.FetchNextPageButton
    ),
  {
    loading: () => <Spinner size="md" />,
    ssr: false,
  }
);

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

  // TODO: populate the url related meta tags with the production url
  const pageTitle = "JSThoughts";
  const pageDescription =
    "Um blog sobre o ecossistema Javascript — por Wendell Kenneddy.";
  const url = process.env.NEXT_PUBLIC_VERCEL_URL;

  return (
    <>
      <Head>
        <meta name="author" content="Wendell Kenneddy" />
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:site_name" content={pageTitle} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:locale" content="pt-BR" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:url" content={url} />
        <title>{pageTitle}</title>
        <link rel="canonical" href={url} />
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
    revalidate: 60 * 60 * 12, // 12 hours
  };
}
