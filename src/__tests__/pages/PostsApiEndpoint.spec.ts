import { mocked } from "jest-mock";

import { NextApiRequest, NextApiResponse } from "next";

import { getPrismicClient } from "../../services/getPrismicClient";

import { calculateReadTime } from "../../lib/calculateReadTime";

import handler from "../../pages/api/posts";

jest.mock("../../services/getPrismicClient");
jest.mock("../../lib/calculateReadTime");

const mockedCalculateReadTime = mocked(calculateReadTime);

mockedCalculateReadTime.mockReturnValue("1min");

const paginatedResults = {
  results: [
    {
      first_publication_date: "2021-12-28T13:08:24+0000",
      uid: "post-3",
      data: {
        title: "Post #3",
        description: "Post #3 description.",
        content: [
          {
            type: "paragraph",
            text: "Something related to post #3.",
            spans: [],
          },
        ],
      },
    },
    {
      first_publication_date: "2021-12-27T13:08:24+0000",
      uid: "post-2",
      data: {
        title: "Post #2",
        description: "Post #2 description.",
        content: [
          {
            type: "paragraph",
            text: "Something related to post #2.",
            spans: [],
          },
        ],
      },
    },
    {
      first_publication_date: "2021-12-26T13:08:24+0000",
      uid: "post-1",
      data: {
        title: "Post #1",
        description: "Post #1 description.",
        content: [
          {
            type: "paragraph",
            text: "Something related to post #1.",
            spans: [],
          },
        ],
      },
    },
  ],
  next_page: null,
};

const unmockedFetch = global.fetch;

describe("Posts API endpoint", () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(paginatedResults),
      });
    });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  it("should return a initial posts data", async () => {
    const mockedGetPrismicClient = mocked(getPrismicClient);
    const req = { method: "GET", query: {} };
    const res = {
      json: (data: any) => data,
      status: () => ({
        json: (data: any) => data,
      }),
    };

    const queryResponse = {
      results: [
        {
          first_publication_date: "2021-12-31T13:08:24+0000",
          uid: "post-6",
          data: {
            title: "Post #6",
            description: "Post #6 description.",
            content: [
              {
                type: "paragraph",
                text: "Something related to post #6.",
                spans: [],
              },
            ],
          },
        },
        {
          first_publication_date: "2021-12-30T13:08:24+0000",
          uid: "post-5",
          data: {
            title: "Post #5",
            description: "Post #5 description.",
            content: [
              {
                type: "paragraph",
                text: "Something related to post #5.",
                spans: [],
              },
            ],
          },
        },
        {
          first_publication_date: "2021-12-29T13:08:24+0000",
          uid: "post-4",
          data: {
            title: "Post #4",
            description: "Post #4 description.",
            content: [
              {
                type: "paragraph",
                text: "Something related to post #4.",
                spans: [],
              },
            ],
          },
        },
      ],
      next_page: "fake-next-page",
    };
    const apiResponse = {
      data: [
        {
          slug: "post-6",
          title: "Post #6",
          description: "Post #6 description.",
          publicationDate: "31 dez 2021",
          readTime: "1min",
        },
        {
          slug: "post-5",
          title: "Post #5",
          description: "Post #5 description.",
          publicationDate: "30 dez 2021",
          readTime: "1min",
        },
        {
          slug: "post-4",
          title: "Post #4",
          description: "Post #4 description.",
          publicationDate: "29 dez 2021",
          readTime: "1min",
        },
      ],
      next_page: "fake-next-page",
    };

    mockedGetPrismicClient.mockReturnValueOnce({
      query: () => Promise.resolve(queryResponse),
    } as any);

    const response = await handler(
      req as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(response).toEqual(apiResponse);
  });

  it("should return a next page if the next_page query param is sent", async () => {
    const req = { method: "GET", query: { next_page: "the-next-page" } };
    const res = {
      json: (data: any) => data,
      status: () => ({
        json: (data: any) => data,
      }),
    };
    const apiResponse = {
      data: [
        {
          slug: "post-3",
          title: "Post #3",
          description: "Post #3 description.",
          publicationDate: "28 dez 2021",
          readTime: "1min",
        },
        {
          slug: "post-2",
          title: "Post #2",
          description: "Post #2 description.",
          publicationDate: "27 dez 2021",
          readTime: "1min",
        },
        {
          slug: "post-1",
          title: "Post #1",
          description: "Post #1 description.",
          publicationDate: "26 dez 2021",
          readTime: "1min",
        },
      ],
      next_page: null,
    };

    const response = await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(response).toEqual(apiResponse);
  });

  it("should return an error if the request method is not GET", async () => {
    const req = { method: "POST" };
    const res = {
      json: (data: any) => data,
      status: () => ({
        json: (data: any) => data,
      }),
    };
    const apiResponse = { error: "Method 'POST' Not Allowed" };

    const response = await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(response).toEqual(apiResponse);
  });
});
