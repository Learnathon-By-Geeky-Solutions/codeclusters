import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, beforeEach, expect, test } from "vitest";
import Order from "./Order";
import axios from "axios";
import { toast } from "react-toastify";

// Mock axios
vi.mock("axios");

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock asset imports
vi.mock("../assets/parcel.png", () => ({
  default: "mock-parcel.png",
}));
vi.mock("../assets/dropdown_icon.png", () => ({
  default: "mock-dropdown.png",
}));

const mockToken = "mockToken";
const mockOrders = [
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
    status: "Order Placed",
    date: "2025-04-20T00:00:00.000Z",
    cancelled: false,
  },
  {
    _id: "order2",
    items: [{ name: "Item 2", quantity: 2, size: "L", _id: "item2" }],
    address: {
      firstName: "Jane",
      lastName: "Smith",
      city: "Another City",
      state: "Another State",
      country: "Another Country",
      zipcode: "67890",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
    },
    paymentMethod: "COD",
    payment: false,
    amount: 200,
    status: "Packing",
    date: "2025-04-21T00:00:00.000Z",
    cancelled: true,
  },
];

describe("Order Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.post.mockReset();
    axios.post.mockResolvedValue({
      data: {
        success: true,
        orders: mockOrders,
        totalPages: 2,
        currentPage: 1,
      },
    });
  });

  test("renders header and fetches orders on initial render", async () => {
    render(<Order token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText("Order Page")).toBeInTheDocument();
      expect(screen.getByText(/Item 1/)).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Method: Stripe")).toBeInTheDocument();
      expect(screen.getByText("Payment: Done")).toBeInTheDocument();
      expect(screen.getByText(/Item 2/)).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Method: COD")).toBeInTheDocument();
      expect(screen.getByText("Payment: Pending")).toBeInTheDocument();
      expect(screen.getAllByText("Items: 1")).toHaveLength(2); // Check both orders
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/order/list?page=1&limit=20"),
      {},
      { headers: { token: mockToken } }
    );
  });

  test("handles API error and shows toast", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    render(<Order token={mockToken} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network Error");
    });
  });

  test("toggles filters visibility on mobile", async () => {
    render(<Order token={mockToken} />);

    const filterButton = screen.getByText("FILTERS");

    fireEvent.click(filterButton);

    expect(screen.getByText("Filter by status")).toBeInTheDocument();
    expect(screen.getByText("Filter by Payment Method")).toBeInTheDocument();
    expect(screen.getByText("Filter by Payment Status")).toBeInTheDocument();

    fireEvent.click(filterButton);

    const dropdownIcon = filterButton.querySelector("img");
    expect(dropdownIcon.className).not.toContain("rotate-90");
  });

  test("filters orders by status", async () => {
    render(<Order token={mockToken} />);

    fireEvent.click(screen.getByText("FILTERS"));
    const statusCheckbox = screen.getByLabelText("Order Placed");
    fireEvent.click(statusCheckbox);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/order/list?page=1&limit=20&status=Order Placed"
        ),
        {},
        { headers: { token: mockToken } }
      );
    });
  });

  test("toggles cancelled orders filter", async () => {
    render(<Order token={mockToken} />);

    const cancelButton = screen.getByText("View cancel request");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/order/list?page=1&limit=20&cancelled=true"
        ),
        {},
        { headers: { token: mockToken } }
      );
      expect(screen.getByText("Show All Products")).toBeInTheDocument();
    });
  });

  test("resets all filters with All Orders button", async () => {
    render(<Order token={mockToken} />);

    fireEvent.click(screen.getByText("FILTERS"));
    fireEvent.click(screen.getByLabelText("Order Placed"));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("&status=Order Placed"),
        {},
        { headers: { token: mockToken } }
      );
    });

    const allOrdersButton = screen.getByText("All Orders");
    fireEvent.click(allOrdersButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/order/list?page=1&limit=20"),
        {},
        { headers: { token: mockToken } }
      );
    });
  });

  test("updates order status successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        orders: mockOrders,
        totalPages: 2,
        currentPage: 1,
      },
    });
    axios.post.mockResolvedValueOnce({
      data: { success: true, message: "Status updated" },
    });

    render(<Order token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText(/Item 1/)).toBeInTheDocument();
    });

    const statusSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(statusSelect, { target: { value: "Shipped" } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/order/status"),
        { orderId: "order1", status: "Shipped" },
        { headers: { token: mockToken } }
      );
      expect(toast.success).toHaveBeenCalledWith("Status updated");
    });
  });

  test("handles cancel order button click", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        orders: [{ ...mockOrders[1], status: "Packing" }], // Order with cancelled: true
        totalPages: 1,
        currentPage: 1,
      },
    });
    axios.post.mockResolvedValueOnce({
      data: { success: true, message: "Order cancelled" },
    });

    render(<Order token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText(/Item 2/)).toBeInTheDocument();
    });

    // Find cancel button by class since it lacks accessible name
    const cancelButton = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("text-red-500"))[0];
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/order/status"),
        { orderId: "order2", status: "Cancelled" },
        { headers: { token: mockToken } }
      );
      expect(toast.success).toHaveBeenCalledWith("Order cancelled");
    });
  });

  test("navigates to next page", async () => {
    render(<Order token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText(/Item 1/)).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/order/list?page=2&limit=20"),
        {},
        { headers: { token: mockToken } }
      );
    });
  });

  test("disables Previous button on first page", async () => {
    render(<Order token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText(/Item 1/)).toBeInTheDocument();
    });

    const previousButton = screen.getByText("Previous");
    expect(previousButton).toBeDisabled();
  });
});
