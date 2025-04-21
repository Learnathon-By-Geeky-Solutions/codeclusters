import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Mock the components that are not the focus of this test
vi.mock("./components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("./components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("./components/Login", () => ({
  default: ({ setToken }) => (
    <div data-testid="login">
      Login Component{" "}
      <button onClick={() => setToken("fake-token")}>Login</button>
    </div>
  ),
}));

vi.mock("./pages/Add", () => ({
  default: () => <div>Add Page</div>,
}));

vi.mock("./pages/List", () => ({
  default: () => <div>List Page</div>,
}));

vi.mock("./pages/Order", () => ({
  default: () => <div>Order Page</div>,
}));

vi.mock("./components/Home", () => ({
  default: () => <div>Home Page</div>,
}));

beforeEach(() => {
  localStorage.clear();
});

describe("App Component", () => {
  it("shows login when no token is present", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("login")).toBeInTheDocument();
  });

  it("shows main layout when token exists", () => {
    localStorage.setItem("token", "fake-token");

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("sets token in localStorage when logging in", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("login")).toBeInTheDocument();

    screen.getByText("Login").click();

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-token");
    });

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
