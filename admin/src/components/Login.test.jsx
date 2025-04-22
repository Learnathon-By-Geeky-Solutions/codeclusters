import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

vi.mock("axios");

describe("Login Component", () => {
  const mockSetToken = vi.fn();

  beforeEach(() => {
    render(
      <>
        <Login setToken={mockSetToken} />
        <ToastContainer />
      </>
    );
  });

  it("renders login form", () => {
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("example@email.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("logs in successfully and sets token", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, token: "mock_token" },
    });

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "adminpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith("mock_token");
      expect(screen.getByText("Welcome admin@test.com")).toBeInTheDocument();
    });
  });

  it("shows error message on failed login", async () => {
    axios.post.mockResolvedValue({
      data: { success: false, message: "Invalid credentials" },
    });

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    );
  });

  it("shows error on network/axios failure", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "adminpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByText("Network Error")).toBeInTheDocument()
    );
  });
});
