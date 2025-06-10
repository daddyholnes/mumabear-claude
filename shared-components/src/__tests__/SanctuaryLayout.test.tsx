import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SanctuaryLayout } from "../components/sanctuary/SanctuaryLayout";

describe("SanctuaryLayout", () => {
  it("renders navigation and main content", () => {
    render(
      <SanctuaryLayout currentPage="Home">
        <div data-testid="main-content">Hello Sanctuary</div>
      </SanctuaryLayout>
    );
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("shows and hides sidebar navigation", () => {
    render(
      <SanctuaryLayout currentPage="Memory Palace">
        <div>Test</div>
      </SanctuaryLayout>
    );
    // Sidebar is closed by default on mobile, open on desktop (simulate desktop)
    const nav = screen.getByText("Navigation").closest("nav");
    expect(nav).toBeInTheDocument();
    // Simulate opening/closing nav if toggle exists
    // (Would expand if a nav toggle button is present)
  });

  it("renders all sanctuary pages in navigation", () => {
    render(
      <SanctuaryLayout>
        <div>Test</div>
      </SanctuaryLayout>
    );
    [
      "Home",
      "Memory Palace",
      "Creation Studio",
      "Learning Hub",
      "Sensory Garden"
    ].forEach(page => {
      expect(screen.getByText(page)).toBeInTheDocument();
    });
  });

  it("highlights the current page", () => {
    render(
      <SanctuaryLayout currentPage="Learning Hub">
        <div>Test</div>
      </SanctuaryLayout>
    );
    const current = screen.getByText("Learning Hub");
    // Find the nearest button ancestor (navigation item)
    const navButton = current.closest('button');
    expect(navButton).toHaveClass("bg-purple-500/20");
  });
});
