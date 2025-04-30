import { render, screen } from "@testing-library/react";
import { vi, describe, beforeEach, expect, test } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

// Mock asset imports
vi.mock("../assets/add.png", () => ({
  default: "mock-add.png",
}));
vi.mock("../assets/schedule.png", () => ({
  default: "mock-schedule.png",
}));
vi.mock("../assets/checkout.png", () => ({
  default: "mock-checkout.png",
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders sidebar with correct container classes", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const sidebar = screen.getByRole("navigation");
    expect(sidebar).toHaveClass("w-[18%]", "min-h-screen", "border-r-2");
  });

  test("renders all NavLink components with correct routes and aria-label", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Add Items" })).toHaveAttribute(
      "href",
      "/add"
    );
    expect(screen.getByRole("link", { name: "List Items" })).toHaveAttribute(
      "href",
      "/list"
    );
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute(
      "href",
      "/order"
    );
  });

  test("renders NavLink text and hides it on smaller screens", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const addItemsText = screen.getByText("Add Items");
    const listItemsText = screen.getByText("List Items");
    const ordersText = screen.getByText("Orders");

    expect(addItemsText).toBeInTheDocument();
    expect(addItemsText).toHaveClass("hidden", "md:block");
    expect(listItemsText).toBeInTheDocument();
    expect(listItemsText).toHaveClass("hidden", "md:block");
    expect(ordersText).toBeInTheDocument();
    expect(ordersText).toHaveClass("hidden", "md:block");
  });

  test("renders images with correct src and alt attributes", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute("src", "mock-add.png");
    expect(images[0]).toHaveAttribute("alt", "Add items icon");
    expect(images[1]).toHaveAttribute("src", "mock-schedule.png");
    expect(images[1]).toHaveAttribute("alt", "List items icon");
    expect(images[2]).toHaveAttribute("src", "mock-checkout.png");
    expect(images[2]).toHaveAttribute("alt", "Orders icon");
  });

  test("applies correct classes to NavLink components", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass(
        "flex",
        "items-center",
        "gap-3",
        "border",
        "border-gray-300",
        "border-r-0",
        "px-3",
        "py-2",
        "rounded-1"
      );
    });
  });

  test("images have correct size classes", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const images = screen.getAllByRole("img");
    images.forEach((image) => {
      expect(image).toHaveClass("w-5", "h-5");
    });
  });
});
