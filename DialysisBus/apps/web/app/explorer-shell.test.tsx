import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExplorerShell } from "./explorer-shell";

describe("ExplorerShell", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => undefined)),
    );
  });

  it("starts with both map layers enabled and no threshold controls", () => {
    render(<ExplorerShell />);

    expect(document.querySelector(".brand-title")).toHaveTextContent("Dialysis Bus");
    expect(document.querySelector(".brand-subtitle")).toHaveTextContent(
      "A Nationwide Dialysis & Transit Public Data Explorer",
    );
    expect(document.querySelector(".map-context")).not.toBeInTheDocument();
    const sectionNavigation = screen.getByRole("navigation", {
      name: "Explorer sections",
    });
    expect(sectionNavigation.parentElement).toHaveClass("panel-heading");
    expect(sectionNavigation.parentElement).toContainElement(
      screen.getByRole("button", { name: "Collapse explorer controls" }),
    );
    expect(screen.getByLabelText("Dialysis facilities")).toBeChecked();
    expect(screen.getByLabelText("Public transit stops")).toBeChecked();
    expect(screen.queryByText("Proximity threshold")).not.toBeInTheDocument();
  });

  it("updates the selected area", () => {
    render(<ExplorerShell />);

    const areaSelector = screen.getByLabelText("Area selector");
    fireEvent.change(areaSelector, {
      target: { value: "AZ" },
    });
    expect(areaSelector).toHaveValue("AZ");
  });

  it("surfaces the methods limitation in a keyboard-accessible tab", () => {
    render(<ExplorerShell />);

    fireEvent.click(screen.getByRole("tab", { name: "Data & Methods" }));
    expect(
      screen.getByText(/Proximity does not measure schedules/i),
    ).toBeInTheDocument();
  });
});
