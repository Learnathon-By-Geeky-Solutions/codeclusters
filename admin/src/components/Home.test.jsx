import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home component", () => {
  it("renders the welcome text", () => {
    render(<Home />);
    expect(screen.getByText("Welcome Admin!")).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    render(<Home />);
    const img = screen.getByRole("img", { name: /admin dashboard logo/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass("h-64", "w-64");
  });
});
