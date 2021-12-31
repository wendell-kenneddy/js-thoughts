import Prismic from "@prismicio/client";
import { getPrismicClient } from "../services/getPrismicClient";

export async function getNextPost(after: string) {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    Prismic.predicates.at("document.type", "post"),
    {
      pageSize: 1,
      after,
      orderings: "[document.first_publication_date]",
    }
  );

  if (!response.results[0]) return null;

  return {
    slug: response.results[0].uid as string,
    title: response.results[0].data.title as string,
  };
}
