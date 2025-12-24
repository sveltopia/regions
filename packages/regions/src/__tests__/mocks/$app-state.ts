// Mock for $app/state in tests
import type { Page } from "@sveltejs/kit";

// Create a reactive mock of the page state
export const page: Page = {
  url: new URL("http://localhost:3000"),
  params: {},
  route: { id: null },
  status: 200,
  error: null,
  data: {}, // This is where page.data.regions would be
  form: null,
  state: {},
};

export const navigating = null;

export const updated = {
  get current() {
    return false;
  },
  check: async () => false,
};
