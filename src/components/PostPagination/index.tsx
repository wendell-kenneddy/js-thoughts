import { Flex } from "@chakra-ui/react";

import { PreviousPost } from "./partials/PreviousPost";
import { NextPost } from "./partials/NextPost";

export interface PaginatedPost {
  slug: string;
  title: string;
}

interface PostPaginationProps {
  previousPost: PaginatedPost | null;
  nextPost: PaginatedPost | null;
}

export function PostPagination({
  previousPost,
  nextPost,
}: PostPaginationProps) {
  function defineJustify() {
    if (previousPost && nextPost) return "space-between";
    if (previousPost && !nextPost) return "flex-start";
    if (!previousPost && nextPost) return "flex-end";
  }

  return (
    <Flex as="section" align="center" justify={defineJustify()}>
      {previousPost && <PreviousPost previousPost={previousPost} />}

      {nextPost && <NextPost nextPost={nextPost} />}
    </Flex>
  );
}
