import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { vi, describe, it, expect, beforeEach } from "vitest";
import List from "../pages/List";
import React from "react";
import { toast } from "react-toastify";
import EditProduct from "../components/EditProduct";

// Mock axios
vi.mock("axios");

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock EditProduct component
vi.mock("../components/EditProduct", () => ({
  default: ({ isOpen }) => (isOpen ? <div>Edit Product Modal</div> : null),
}));

const mockProducts = [
  {
    _id: "1",
    name: "Product 1",
    category: "Men",
    price: 100,
    image: ["Uploads/image1.jpg"],
  },
  {
    _id: "2",
    name: "Product 2",
    category: "Women",
    price: 150,
    image: ["Uploads/image2.jpg"],
  },
];

describe("List Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the header correctly", () => {
    render(<List token="test-token" />);
    expect(screen.getByText("All Products List")).toBeInTheDocument();
  });

  it("fetches and displays products", async () => {
    axios.get.mockResolvedValue({
      data: { success: true, products: mockProducts },
    });

    render(<List token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
      expect(screen.getByText("Men")).toBeInTheDocument();
      expect(screen.getByText("Women")).toBeInTheDocument();
      expect(screen.getByText("৳100")).toBeInTheDocument();
      expect(screen.getByText("৳150")).toBeInTheDocument();
    });
  });

  it("handles fetch error and shows toast", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    render(<List token="test-token" />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network Error");
    });
  });

  it("removes a product successfully", async () => {
    axios.get.mockResolvedValue({
      data: { success: true, products: mockProducts },
    });
    axios.post.mockResolvedValue({
      data: { success: true, message: "Product removed successfully" },
    });

    render(<List token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });

    // Find delete button by class (bg-red-500)
    const deleteButtons = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("bg-red-500"));
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        { id: "1" },
        { headers: { token: "test-token" } }
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Product removed successfully"
      );
    });
  });

  it("handles remove product error", async () => {
    axios.get.mockResolvedValue({
      data: { success: true, products: mockProducts },
    });
    axios.post.mockRejectedValue(new Error("Remove Error"));

    render(<List token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });

    // Find delete button by class (bg-red-500)
    const deleteButtons = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("bg-red-500"));
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Remove Error");
    });
  });

  it("opens EditProduct modal on edit button click", async () => {
    axios.get.mockResolvedValue({
      data: { success: true, products: mockProducts },
    });

    render(<List token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });

    // Find edit button by class (bg-green-500)
    const editButtons = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("bg-green-500"));
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit Product Modal")).toBeInTheDocument();
    });
  });
});
