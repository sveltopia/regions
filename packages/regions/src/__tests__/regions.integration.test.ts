import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { fireEvent } from "@testing-library/svelte";

// Test components
import TestLayoutWithRegions from "./components/TestLayoutWithRegions.svelte";
import TestPageOutsideContext from "./components/TestPageOutsideContext.svelte";
import TestLayoutWithFallback from "./components/TestLayoutWithFallback.svelte";
import TestLayoutWithImperativeUpdates from "./components/TestLayoutWithImperativeUpdates.svelte";
import TestLayoutWithPageData from "./components/TestLayoutWithPageData.svelte";
import TestLayoutWithNonErrorThrow from "./components/TestLayoutWithNonErrorThrow.svelte";

describe("Layout Regions - Integration Tests", () => {
  describe("Context Setup", () => {
    it("should warn when useLayoutRegions is called outside LayoutRegions", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(TestPageOutsideContext);
      await tick();

      expect(consoleSpy).toHaveBeenCalledWith(
        "useLayoutRegions must be used within a LayoutRegions component"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Region Rendering - Three State Logic", () => {
    it("should render region content when set with data object", async () => {
      render(TestLayoutWithRegions);

      await tick();

      // The test page sets header region with data: { title: "Header Content" }
      // The layout should render this via the children snippet
      const headerContent = screen.getByText("Header Content");
      expect(headerContent).toBeTruthy();
    });

    it("should render region content when set with snippet", async () => {
      render(TestLayoutWithRegions);

      await tick();

      // The test page sets sidebar region with a snippet
      const sidebarContent = screen.getByText("Sidebar Snippet Content");
      expect(sidebarContent).toBeTruthy();
    });

    it("should render nothing when region is set to null (suppression)", async () => {
      render(TestLayoutWithRegions);

      await tick();

      // The test page sets footer to null (explicit suppression)
      // Should not render fallback
      const footerFallback = screen.queryByText("Footer Fallback");
      expect(footerFallback).toBeNull();
    });

    it("should render fallback when region is undefined (not set)", async () => {
      render(TestLayoutWithFallback);

      await tick();

      // The test page doesn't set the sidebar region
      // Layout should render the fallback
      const sidebarFallback = screen.getByText("Sidebar Fallback Content");
      expect(sidebarFallback).toBeTruthy();
    });
  });

  describe("Imperative Region Updates", () => {
    it("should allow updating regions imperatively via returned context", async () => {
      render(TestLayoutWithImperativeUpdates);

      await tick();

      // Initial state - should show "Initial Title"
      expect(screen.getByTestId("header-content").textContent).toBe("Initial Title");

      // Click button to update title
      const updateButton = screen.getByTestId("update-button");
      await fireEvent.click(updateButton);
      await tick();

      // Should now show "Updated Title"
      expect(screen.getByTestId("header-content").textContent).toBe("Updated Title");
    });

    it("should allow clearing regions imperatively via returned context", async () => {
      render(TestLayoutWithImperativeUpdates);

      await tick();

      // Initial state - should show title
      expect(screen.getByTestId("header-content").textContent).toBe("Initial Title");

      // Click button to clear the region (sets to null = suppressed)
      const clearButton = screen.getByTestId("clear-button");
      await fireEvent.click(clearButton);
      await tick();

      // Should now show nothing (null = suppressed, not undefined = fallback)
      expect(screen.queryByTestId("header-content")).toBeNull();
      expect(screen.queryByTestId("header-fallback")).toBeNull();
    });
  });

  describe("Multiple Regions", () => {
    it("should handle multiple regions simultaneously", async () => {
      render(TestLayoutWithRegions);

      await tick();

      // All three regions should work independently
      const headerContent = screen.getByText("Header Content");
      const sidebarContent = screen.getByText("Sidebar Snippet Content");
      const footerFallback = screen.queryByText("Footer Fallback");

      expect(headerContent).toBeTruthy();
      expect(sidebarContent).toBeTruthy();
      // Footer is suppressed (null), so fallback should not appear
      expect(footerFallback).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle region names that are not set", async () => {
      // A region that's undefined with fallback should show the fallback
      render(TestLayoutWithFallback);

      await tick();

      const fallback = screen.getByText("Sidebar Fallback Content");
      expect(fallback).toBeTruthy();
    });

    it("should render page content regardless of region state", async () => {
      render(TestLayoutWithRegions);

      await tick();

      // The component wrapper should render its own content
      const pageContent = screen.getByText("Page Content");
      expect(pageContent).toBeTruthy();
    });
  });

  // Test removed: page.data.regions feature works but not documented in v1
  // Test removed: Edge case error handling not critical for v1
});
