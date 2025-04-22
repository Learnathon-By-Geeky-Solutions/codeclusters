import { render, screen, fireEvent } from "@testing-library/react";
import EditProduct from "./EditProduct";
import { vi } from "vitest";
import { toast } from "react-toastify";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("EditProduct", () => {
  const mockProduct = {
    _id: "123",
    name: "Test Product",
    description: "A sample product",
    price: 100,
    sellingPrice: 90,
    category: "Men",
    subCategory: "Topwear",
    size: ["M", "L"],
    bestSeller: true,
    image: [],
  };

  const mockClose = vi.fn();

  it("renders product form when open", () => {
    render(
      <EditProduct
        isOpen={true}
        onClose={mockClose}
        product={mockProduct}
        token="token"
      />
    );
    expect(screen.getByDisplayValue("Test Product")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { container } = render(
      <EditProduct
        isOpen={false}
        onClose={mockClose}
        product={mockProduct}
        token="token"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("toggles size buttons", () => {
    render(
      <EditProduct
        isOpen={true}
        onClose={mockClose}
        product={mockProduct}
        token="token"
      />
    );
    const sizeS = screen.getByText("S");
    fireEvent.click(sizeS);
    expect(sizeS).toHaveClass("bg-sky-200");
  });
});
