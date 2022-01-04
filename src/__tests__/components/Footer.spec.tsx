import { render, screen } from "@testing-library/react";

import { Footer } from "../../components/Footer";

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
    render(<Footer />);
    const link = screen.getByText("Wendell Kenneddy").closest("a");

    expect(screen.getByText("Feito com 💛 por")).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAccessibleName("Wendell Kenneddy");
    expect(link).toHaveAttribute("href", "https://github.com/wendell-kenneddy");
  });
});
