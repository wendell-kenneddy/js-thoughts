import { render, screen } from "@testing-library/react";

import { PostCard } from "../../components/PostCard";

jest.mock("@chakra-ui/react", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return {
    ...chakra,
  };
});

const POST = {
  slug: "my-new-post",
  title: "My new post",
  description: "A new post.",
  publicationDate: "30 dez 2021",
  readTime: "5min",
};

describe("PostCard component", () => {
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
    render(<PostCard post={POST} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("A new post.")).toBeInTheDocument();
    expect(screen.getByText("30 dez 2021")).toBeInTheDocument();
    expect(screen.getByText("5min")).toBeInTheDocument();
  });
});
