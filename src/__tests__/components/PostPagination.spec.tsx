import { render, screen } from "@testing-library/react";

import { PostPagination } from "../../components/PostPagination";

jest.mock("@chakra-ui/react", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return {
    ...chakra,
  };
});

const NEXT_POST = {
  slug: "next-post",
  title: "My new post 2",
};

const PREVIOUS_POST = {
  slug: "previous-post",
  title: "My new post",
};

describe("PostPagination component", () => {
  beforeAll(() => {
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
  });

  it("should render correctly", () => {
    render(
      <PostPagination previousPost={PREVIOUS_POST} nextPost={NEXT_POST} />
    );

    const prevPost = screen.getByText("Post anterior").closest("a");
    const nextPost = screen.getByText("Próximo post").closest("a");

    // previous post
    expect(prevPost).toBeInTheDocument();
    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(prevPost).toHaveAttribute("href", "/posts/previous-post");

    // next post
    expect(nextPost).toBeInTheDocument();
    expect(screen.getByText("My new post 2")).toBeInTheDocument();
    expect(nextPost).toHaveAttribute("href", "/posts/next-post");
  });

  it("should have justify set to flex-end if only next post is present", () => {
    render(<PostPagination previousPost={null} nextPost={NEXT_POST} />);

    const section = screen.getByText("Próximo post").closest("section");

    expect(section).toBeInTheDocument();
    expect(section).toHaveStyle("justify-content: flex-end");
  });

  it("should have justify set to flex-start if only previous post is present", () => {
    render(<PostPagination previousPost={PREVIOUS_POST} nextPost={null} />);

    const section = screen.getByText("Post anterior").closest("section");

    expect(section).toBeInTheDocument();
    expect(section).toHaveStyle("justify-content: flex-start");
  });

  it("should have justify set to space-between if both posts are present", () => {
    render(
      <PostPagination previousPost={PREVIOUS_POST} nextPost={NEXT_POST} />
    );

    const section = screen.getByText("Post anterior").closest("section");

    expect(section).toBeInTheDocument();
    expect(section).toHaveStyle("justify-content: space-between");
  });
});
