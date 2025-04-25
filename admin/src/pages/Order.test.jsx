import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, expect, test } from "vitest";
import Order from "./Order";
import axios from "axios";

// Mock axios and toast
vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockToken = "mockToken";

describe("Order Component - Fetching Orders", () => {
  beforeEach(() => {
    // Mocking axios response for fetching orders
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        orders: [
          {
            _id: "order1",
            items: [{ name: "Item 1", quantity: 1, size: "M", _id: "item1" }],
            address: {
              firstName: "John",
              lastName: "Doe",
              city: "Test City",
              state: "Test State",
              country: "Test Country",
              zipcode: "12345",
              email: "john.doe@example.com",
              phone: "123-456-7890",
            },
            paymentMethod: "Stripe",
            payment: true,
            amount: 100,
            status: "Order placed",
            date: "2025-04-20T00:00:00.000Z",
            cancelled: false,
          },
        ],
        totalPages: 1,
        currentPage: 1,
      },
    });
  });

  test("fetches and displays orders on initial render", async () => {
    render(<Order token={mockToken} />);

    // Wait for the orders to be fetched and rendered
    await waitFor(() => screen.getByText("Order Page"));

    // Check if the order details are displayed
    expect(screen.getByText("Item 1 x 1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByText("Test City, Test State, Test Country, 12345")
    ).toBeInTheDocument();
    expect(screen.getByText("Method: Stripe")).toBeInTheDocument();
    expect(screen.getByText("Payment: Done")).toBeInTheDocument();
    expect(screen.getByText("Items: 1")).toBeInTheDocument();

    // Verify the axios call was made
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/order/list?page=1&limit=20"),
      {},
      { headers: { token: mockToken } }
    );
  });
});
