import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import axios from "axios";
import ChangePassword from "./ChangePassword";

vi.mock("axios");

describe("ChangePassword Component - Fetching", () => {
  const mockOnClose = vi.fn();

  it("submits password change successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Password changed successfully",
      },
    });

    render(
      <ChangePassword isOpen={true} onClose={mockOnClose} token="mock-token" />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter current password"), {
      target: { value: "oldpassword" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/user/admin/changePassword"),
        { currentPassword: "oldpassword", newPassword: "newpassword123" },
        { headers: { token: "mock-token" } }
      );
    });
  });
});
