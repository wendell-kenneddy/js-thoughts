import { render, screen } from "@testing-library/react";

import ServerError from "../../pages/500";

describe("500 error page", () => {
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
    render(<ServerError />);

    expect(
      screen.getByText("Oops... Ocorreu um erro no servidor :/")
    ).toBeInTheDocument();

    expect(screen.getByAltText("Erro interno no servidor")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Voltar para a página principal",
      })
    ).toBeInTheDocument();
  });
});
