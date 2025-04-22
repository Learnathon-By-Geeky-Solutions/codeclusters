import { render, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import { vi, describe, it, expect } from "vitest";
import List from "../pages/List";
import React from "react";

// Mock axios
vi.mock("axios");

const mockProducts = [
  {
    _id: "1",
    name: "Product 1",
    category: "Men",
    price: 100,
    image: ["uploads/image1.jpg"],
  },
  {
    _id: "2",
    name: "Product 2",
    category: "Women",
    price: 150,
    image: ["uploads/image2.jpg"],
  },
];

describe("List Component - Fetching Products", () => {
  it("fetches and displays products", async () => {
    axios.get.mockResolvedValue({
      data: { success: true, products: mockProducts },
    });

    render(<List token="test-token" />);

    // Wait for product names to appear
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });
});
