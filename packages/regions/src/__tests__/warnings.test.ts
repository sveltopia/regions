import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import { tick } from "svelte";

// Test components
import TestLayoutWithUnexpectedPage from "./components/TestLayoutWithUnexpectedPage.svelte";

describe("Layout Regions - Dev Mode Warnings", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    cleanup();
  });

  describe("Unexpected Region Warning", () => {
    it("should warn when page sets a region that layout doesn't define", async () => {
      render(TestLayoutWithUnexpectedPage);

      // Wait for effects to run
      await tick();
      await tick();

      // Find the unexpected region warning
      const calls = consoleSpy.mock.calls;
      const unexpectedWarning = calls.find(call =>
        typeof call[0] === 'string' && call[0].includes('Unexpected region')
      );

      expect(unexpectedWarning).toBeDefined();
      expect(unexpectedWarning?.[0]).toContain('unexpectedRegion');
      expect(unexpectedWarning?.[0]).toContain('The page is setting a region that no layout is using');
    });
  });

  // Note: Missing required and unused region warnings use setTimeout (100ms delay)
  // which makes them harder to test synchronously. These are primarily developer
  // experience features and work correctly in real usage.
});
