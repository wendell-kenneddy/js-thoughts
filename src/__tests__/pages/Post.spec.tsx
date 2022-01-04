import { render, screen } from "@testing-library/react";

import { mocked } from "jest-mock";

import preloadAll from "jest-next-dynamic";

import { getPrismicClient } from "../../services/getPrismicClient";

import { getNextPost } from "../../lib/getNextPost";
import { getPreviousPost } from "../../lib/getPreviousPost";
import { calculateReadTime } from "../../lib/calculateReadTime";

import Post, { getStaticProps, getStaticPaths } from "../../pages/posts/[slug]";

jest.mock("../../services/getPrismicClient");
jest.mock("../../lib/getNextPost");
jest.mock("../../lib/getPreviousPost");
jest.mock("../../lib/calculateReadTime");

const POST = {
  title: "My new post",
  description: "A new post.",
  content: "<p>Um novo post.</p>",
  publicationDate: "31 dez 2021",
  lastEditedDate: "04 jan 2022",
  readTime: "5min",
};

const NEXT_POST = {
  slug: "the-next-post",
  title: "The next post",
};

const PREV_POST = {
  slug: "the-previous-post",
  title: "The previous post",
};

describe("Post page", () => {
  beforeAll(async () => await preloadAll());

  it("should render correctly", () => {
    render(<Post post={POST} previousPost={null} nextPost={null} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Um novo post.")).toBeInTheDocument();
    expect(screen.getByText("31 dez 2021")).toBeInTheDocument();
    expect(screen.getByText("04 jan 2022")).toBeInTheDocument();
    expect(screen.getByText("5min")).toBeInTheDocument();
  });

  it("should not render last edited date if it is equal to publication date", () => {
    render(
      <Post
        post={{
          ...POST,
          lastEditedDate: POST.publicationDate,
        }}
        previousPost={null}
        nextPost={null}
      />
    );

    const dates = screen.getAllByText("31 dez 2021");

    expect(dates.length).toEqual(1);
  });

  it("should render previous and next posts correctly", () => {
    render(<Post post={POST} previousPost={PREV_POST} nextPost={NEXT_POST} />);

    expect(screen.getByText("Post anterior")).toBeInTheDocument();
    expect(screen.getByText("The previous post")).toBeInTheDocument();

    expect(screen.getByText("Próximo post")).toBeInTheDocument();
    expect(screen.getByText("The next post")).toBeInTheDocument();
  });

  it("should load initial paths using getStaticPaths", async () => {
    const mockedPrismicClient = mocked(getPrismicClient);
    const queryResponse = {
      results: [
        {
          uid: "my-new-post",
        },
        {
          uid: "my-other-post",
        },
      ],
    };
    const getStaticPathsReturn = [
      {
        params: { slug: "my-new-post" },
      },
      {
        params: { slug: "my-other-post" },
      },
    ];

    mockedPrismicClient.mockReturnValueOnce({
      query: () => Promise.resolve(queryResponse),
    } as any);

    const response = await getStaticPaths({});

    expect(response.paths).toEqual(getStaticPathsReturn);
  });

  it("should return post, nextPost and previousPost using getStaticProps", async () => {
    const mockedPrismicClient = mocked(getPrismicClient);
    const mockedGetNextPost = mocked(getNextPost);
    const mockedGetPreviousPost = mocked(getPreviousPost);
    const mockedCalculateReadTime = mocked(calculateReadTime);
    const getByUIDResponse = {
      first_publication_date: "2021-12-30T13:08:24+0000",
      last_publication_date: "2021-12-31T18:23:15+0000",
      data: {
        title: "My new post",
        description: "A new post.",
        content: [
          {
            type: "paragraph",
            text: "A new post about Javascript array methods.",
            spans: [],
          },
        ],
      },
    };
    const getStaticPropsResponse = expect.objectContaining({
      props: {
        post: {
          title: "My new post",
          description: "A new post.",
          content: "<p>A new post about Javascript array methods.</p>",
          publicationDate: "30 dez 2021",
          lastEditedDate: "31 dez 2021",
          readTime: "1min",
        },
        previousPost: { slug: "prev-post", title: "The previous post" },
        nextPost: { slug: "next-post", title: "The next post" },
      },
    });
    const params = { slug: "my-new-post" };

    mockedGetPreviousPost.mockResolvedValueOnce({
      slug: "prev-post",
      title: "The previous post",
    });

    mockedGetNextPost.mockResolvedValueOnce({
      slug: "next-post",
      title: "The next post",
    });

    mockedCalculateReadTime.mockReturnValueOnce("1min");

    mockedPrismicClient.mockReturnValueOnce({
      getByUID: () => Promise.resolve(getByUIDResponse),
    } as any);

    const response = await getStaticProps({ params });

    expect(response).toEqual(getStaticPropsResponse);
  });
});
