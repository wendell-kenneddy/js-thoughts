import { render, screen } from "@testing-library/react";

import { Loading } from "../../components/Loading";

jest.mock("@chakra-ui/react", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return {
    ...chakra,
  };
});

describe("Footer component", () => {
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
    render(<Loading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
