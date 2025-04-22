import { render, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import { vi, describe, it, expect } from "vitest";
import React from "react";
import Order from "../pages/Order";

// Mock axios
vi.mock("axios");

const mockOrders = [
  {
    _id: "order1",
    items: [
      { _id: "item1", name: "Shirt", quantity: 2, size: "M" },
      { _id: "item2", name: "Pants", quantity: 1, size: "L" },
    ],
    address: {
      firstName: "John",
      lastName: "Doe",
      city: "City",
      state: "State",
      country: "Country",
      zipcode: "12345",
      email: "john@example.com",
      phone: "1234567890",
    },
    paymentMethod: "Card",
    payment: true,
    amount: 250,
    status: "Order placed",
    date: "2024-04-20T00:00:00.000Z",
  },
];

describe("Order Component - Fetching Orders", () => {
  it("fetches and displays orders", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        orders: mockOrders,
        currentPage: 1,
        totalPages: 1,
      },
    });

    render(<Order token="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Order Page")).toBeInTheDocument();
      expect(screen.getByText("Shirt x 2")).toBeInTheDocument();
      expect(screen.getByText("Pants x 1")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });
});
