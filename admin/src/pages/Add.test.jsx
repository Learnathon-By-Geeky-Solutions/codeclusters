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

    // Fill out name and description, but don't upload an image
    fireEvent.change(screen.getByPlaceholderText(/Sweatshirt/i), {
      target: { value: "Product Name" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Write description/i), {
      target: { value: "Product description" },
    });

    fireEvent.click(screen.getByText("ADD"));

    await waitFor(() => {
      // Verify if the error toast was called with the correct message
      expect(toast.error).toHaveBeenCalledWith("Image required");
    });
  });

  it("submits the form when image and data are provided", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, message: "Added successfully" },
    });

    render(<Add token={mockToken} />);

    // Create dummy image file
    const file = new File(["dummy"], "image.png", { type: "image/png" });

    // Get the input element for the file upload and simulate the change event
    const input = screen.getByLabelText("Upload image 1");

    // Fire the change event to simulate file selection
    fireEvent.change(input, { target: { files: [file] } });

    // Fill out name and description
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

    // Get the input element for the file upload and simulate the change event
    const input = screen.getByLabelText("Upload image 1");

    // Fire the change event to simulate file selection
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
});
