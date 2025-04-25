import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, beforeEach, test, expect } from "vitest";
import Navbar from "./Navbar";
import ChangePassword from "./ChangePassword";

// Mock the ChangePassword component since we don't need to test it here
vi.mock("./ChangePassword", () => ({
  __esModule: true,
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <div role="dialog">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe("Navbar Component", () => {
  const mockSetToken = vi.fn();

  beforeEach(() => {
    // Reset the mock before each test to ensure it's not affected by previous tests
    mockSetToken.mockClear();
  });

  test("renders Navbar correctly", () => {
    render(<Navbar setToken={mockSetToken} token="mockToken" />);

    // Check if the Change Password and Logout buttons are present
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test('opens Change Password modal when "Change Password" button is clicked', () => {
    render(<Navbar setToken={mockSetToken} token="mockToken" />);

    // Check if the modal is not present initially
    expect(screen.queryByRole("dialog")).toBeNull();

    // Click on the "Change Password" button
    fireEvent.click(screen.getByText("Change Password"));

    // Check if the modal is now displayed
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("closes Change Password modal when close button is clicked", () => {
    render(<Navbar setToken={mockSetToken} token="mockToken" />);

    // Open the Change Password modal
    fireEvent.click(screen.getByText("Change Password"));

    // Check if the modal is open
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close the modal by clicking the "Close" button inside the modal
    fireEvent.click(screen.getByText("Close"));

    // Check if the modal is closed
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test('calls setToken with empty string when "Logout" button is clicked', () => {
    render(<Navbar setToken={mockSetToken} token="mockToken" />);

    // Click on the "Logout" button
    fireEvent.click(screen.getByText("Logout"));

    // Check if setToken was called with an empty string
    expect(mockSetToken).toHaveBeenCalledWith("");
  });
});
