import { render, screen } from "@testing-library/react";

import NotFound from "../../pages/404";

describe("404 error page", () => {
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
    render(<NotFound />);

    expect(
      screen.getByText("Oops... Página não encontrada :/")
    ).toBeInTheDocument();

    expect(screen.getByAltText("Página não encontrada")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Voltar para a página principal",
      })
    ).toBeInTheDocument();
  });
});
