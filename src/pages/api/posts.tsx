import { NextApiRequest, NextApiResponse } from "next";

import Prismic from "@prismicio/client";
import ApiSearchResponse from "@prismicio/client/types/ApiSearchResponse";

import { getPrismicClient } from "../../services/getPrismicClient";

import { calculateReadTime } from "../../lib/calculateReadTime";
import { formatDate } from "../../lib/formatDate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { next_page } = req.query;

    try {
      if (next_page) {
        const response = await fetch(String(next_page));
        const data = (await response.json()) as ApiSearchResponse;

        const formattedData = data.results.map((post) => ({
          slug: post.uid,
          title: post.data.title,
          description: post.data.description,
          publicationDate: formatDate(
            new Date(String(post.first_publication_date))
          ),
          readTime: calculateReadTime(post.data.content),
        }));

        return res.json({
          data: formattedData,
          next_page: data.next_page,
        });
      }

      const prismic = getPrismicClient();

      const postsResponse = await prismic.query(
        Prismic.predicates.at("document.type", "post"),
        {
          fetch: ["post.title", "post.description", "post.content"],
          orderings: "[document.first_publication_date desc]",
          pageSize: 5,
        }
      );

      const formattedData = postsResponse.results.map((post) => ({
        slug: post.uid,
        title: post.data.title,
        description: post.data.description,
        publicationDate: formatDate(
          new Date(String(post.first_publication_date))
        ),
        readTime: calculateReadTime(post.data.content),
      }));

      return res.json({
        data: formattedData,
        next_page: postsResponse.next_page,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}
