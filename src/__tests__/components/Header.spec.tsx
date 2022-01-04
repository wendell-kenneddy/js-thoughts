import { render, screen, fireEvent } from "@testing-library/react";

import { Header } from "../../components/Header";

let color: "light" | "dark" = "light";
const mockedToggleColorMode = jest.fn().mockImplementation(() => {
  color === "light" ? (color = "dark") : (color = "light");
  return;
});

jest.mock("@chakra-ui/react", () => {
  const chakra = jest.requireActual("@chakra-ui/react");
  return {
    ...chakra,
    useColorMode: () => ({
      toggleColorMode: mockedToggleColorMode,
    }),
  };
});

describe("Header component", () => {
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
    render(<Header />);

    expect(screen.getByText("JS")).toBeInTheDocument();
    expect(screen.getByText("Thoughts")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Mudar tema",
      })
    ).toBeInTheDocument();
  });

  it("should change theme when user clicks the theme button", () => {
    render(<Header />);

    const themeButton = screen.getByRole("button", {
      name: "Mudar tema",
    });

    color = "light";

    fireEvent.click(themeButton);
    expect(mockedToggleColorMode).toHaveBeenCalled();
    expect(color).toEqual("dark");

    fireEvent.click(themeButton);
    expect(mockedToggleColorMode).toHaveBeenCalled();
    expect(color).toEqual("light");
  });
});
