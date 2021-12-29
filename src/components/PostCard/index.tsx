import { Flex } from "@chakra-ui/react";

import { PostCardData } from "./partials/PostCardData";
import { PostCardMetadata } from "./partials/PostCardMetadata";

interface Post {
  slug: string;
  title: string;
  description: string;
  publicationDate: string;
  readTime: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { slug, title, description, publicationDate, readTime } = post;

  return (
    <Flex flexDir="column" w="100%" align="flex-start" pb="4">
      <PostCardData slug={slug} title={title} description={description} />

      <PostCardMetadata
        publcationDate={publicationDate}
        readTime={readTime}
        mt="4"
      />
    </Flex>
  );
}
