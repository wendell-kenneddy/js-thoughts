import { render, screen, fireEvent } from "@testing-library/react";

import { mocked } from "jest-mock";

import preloadAll from "jest-next-dynamic";

import { useInfiniteQuery } from "react-query";

import { getPrismicClient } from "../../services/getPrismicClient";

import { calculateReadTime } from "../../lib/calculateReadTime";

import Home, { getStaticProps } from "../../pages/index";

jest.mock("../../services/getPrismicClient");
jest.mock("../../lib/calculateReadTime");
jest.mock("react-query");

const POST_PAGINATION = [
  {
    data: [
      {
        slug: "post-3",
        title: "Post #3",
        description: "Post #3 description.",
        publicationDate: "31 dez 2021",
        readTime: "1min",
      },
      {
        slug: "post-2",
        title: "Post #2",
        description: "Post #2 description.",
        publicationDate: "30 dez 2021",
        readTime: "1min",
      },
      {
        slug: "post-1",
        title: "Post #1",
        description: "Post #1 description.",
        publicationDate: "29 dez 2021",
        readTime: "1min",
      },
    ],
    next_page: "fake-next-page",
  },
];

describe("Post page", () => {
  beforeAll(async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    await preloadAll();
  });

  it("should render posts correctly", () => {
    const mockedUseInfiniteQuery = mocked(useInfiniteQuery);

    mockedUseInfiniteQuery.mockReturnValueOnce({
      data: {
        pageParams: [],
        pages: POST_PAGINATION,
      },
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    } as any);

    render(<Home postPagination={POST_PAGINATION} />);

    expect(screen.getByText("Post #3")).toBeInTheDocument();
    expect(screen.getByText("Post #3 description."));
    expect(screen.getByText("31 dez 2021"));

    expect(screen.getByText("Post #2")).toBeInTheDocument();
    expect(screen.getByText("Post #2 description."));
    expect(screen.getByText("30 dez 2021"));

    expect(screen.getByText("Post #1")).toBeInTheDocument();
    expect(screen.getByText("Post #1 description."));
    expect(screen.getByText("29 dez 2021"));

    expect(screen.getAllByText("1min").length).toEqual(3);
  });

  it("should render FetchNextPageButton if hasNextPage is true", () => {
    const mockedUseInfiniteQuery = mocked(useInfiniteQuery);

    mockedUseInfiniteQuery.mockReturnValueOnce({
      data: {
        pageParams: [],
        pages: POST_PAGINATION,
      },
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    } as any);

    render(<Home postPagination={POST_PAGINATION} />);

    expect(
      screen.getByRole("button", {
        name: "Carregar mais",
      })
    ).toBeInTheDocument();
  });

  it("should be able to fetch a next page", () => {
    const mockedUseInfiniteQuery = mocked(useInfiniteQuery);
    const fetchNextPageMocked = jest.fn();

    mockedUseInfiniteQuery.mockReturnValueOnce({
      data: {
        pageParams: [],
        pages: POST_PAGINATION,
      },
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: fetchNextPageMocked,
    } as any);

    render(<Home postPagination={POST_PAGINATION} />);

    const fetchButton = screen.getByRole("button", {
      name: "Carregar mais",
    });

    fireEvent.click(fetchButton);

    expect(fetchNextPageMocked).toHaveBeenCalled();
  });

  it("should return a initial postPagination using getStaticProps", async () => {
    const mockedGetPrismicClient = mocked(getPrismicClient);
    const mockedCalculateReadTime = mocked(calculateReadTime);
    const queryResponse = {
      results: [
        {
          first_publication_date: "2021-12-31T13:08:24+0000",
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
          first_publication_date: "2021-12-30T13:08:24+0000",
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
          first_publication_date: "2021-12-29T13:08:24+0000",
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
      next_page: "fake-next-page",
    };
    const getStaticPropsReturn = expect.objectContaining({
      postPagination: POST_PAGINATION,
    });

    mockedGetPrismicClient.mockReturnValueOnce({
      query: () => Promise.resolve(queryResponse),
    } as any);

    mockedCalculateReadTime.mockReturnValue("1min");

    const response = await getStaticProps();

    expect(response.props).toEqual(getStaticPropsReturn);
  });
});
