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

  it("starts with both map layers and the 400 meter threshold enabled", () => {
    render(<ExplorerShell />);

    expect(screen.getByLabelText("Dialysis facilities")).toBeChecked();
    expect(screen.getByLabelText("Public transit stops")).toBeChecked();
    expect(screen.getByRole("button", { name: "400" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("updates the selected threshold and state extent", () => {
    render(<ExplorerShell />);

    fireEvent.click(screen.getByRole("button", { name: "800" }));
    expect(screen.getByRole("button", { name: "800" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.change(screen.getByLabelText("Analysis extent"), {
      target: { value: "AZ" },
    });
    expect(screen.getByText("AZ selected-state extent")).toBeInTheDocument();
  });

  it("surfaces the methods limitation in a keyboard-accessible tab", () => {
    render(<ExplorerShell />);

    fireEvent.click(screen.getByRole("tab", { name: "Data & Methods" }));
    expect(
      screen.getByText(/Proximity does not measure schedules/i),
    ).toBeInTheDocument();
  });
});
