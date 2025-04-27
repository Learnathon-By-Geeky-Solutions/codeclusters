import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Add from "./Add";
import axios from "axios";
import { toast } from "react-toastify";

// Mock axios and toast
vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock URL.createObjectURL to avoid issues in the test environment
vi.stubGlobal("URL", {
  createObjectURL: vi.fn(() => "mocked-url"),
});

const mockToken = "mock-token";

describe("Add Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows error if no image is uploaded", async () => {
    render(<Add token={mockToken} />);

    fireEvent.change(screen.getByPlaceholderText(/Sweatshirt/i), {
      target: { value: "Product Name" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Write description/i), {
      target: { value: "Product description" },
    });

    fireEvent.click(screen.getByText("ADD"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Image required");
    });
  });

  it("submits the form when image and data are provided", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, message: "Added successfully" },
    });

    render(<Add token={mockToken} />);

    const file = new File(["dummy"], "image.png", { type: "image/png" });

    const input = screen.getByLabelText("Upload image 1");
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.change(screen.getByPlaceholderText(/Sweatshirt/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Write description/i), {
      target: { value: "This is a test product." },
    });

    fireEvent.click(screen.getByText("ADD"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Added successfully");
    });
  });

  it("shows toast error on request failure", async () => {
    axios.post.mockRejectedValue(new Error("Something went wrong"));

    render(<Add token={mockToken} />);

    const file = new File(["dummy"], "image.png", { type: "image/png" });

    const input = screen.getByLabelText("Upload image 1");
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.change(screen.getByPlaceholderText(/Sweatshirt/i), {
      target: { value: "Another Product" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Write description/i), {
      target: { value: "Product desc" },
    });

    fireEvent.click(screen.getByText("ADD"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });

  // ✅ New Test for Uploading CSV File
  it("uploads a CSV file and calls the API", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, message: "Bulk upload successful" },
    });

    render(<Add token={mockToken} />);

    const file = new File(["id,name,price\n1,Product,10"], "products.csv", {
      type: "text/csv",
    });

    // Find the file input (by accept attribute)
    const fileInput = screen.getByLabelText("Upload CSV/XSLX file", {
      selector: "input",
    });

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Find and click the Upload button
    fireEvent.click(screen.getByRole("button", { name: /Upload/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/product/uploadBulkProduct"),
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({ token: mockToken }),
        })
      );
      expect(toast.success).toHaveBeenCalledWith("Bulk upload successful");
    });
  });
});
