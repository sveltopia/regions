import { vi } from 'vitest';

// Ensure browser globals are available for Svelte 5 component mounting
// Note: In jsdom environment, global.window is already set by vitest
if (typeof globalThis.window === 'undefined' && typeof global !== 'undefined') {
	globalThis.window = (global as any).window;
}

// Mock $app/state
vi.mock('$app/state', () => ({
	page: {
		get url() {
			return { pathname: '/test' };
		},
		get data() {
			return {};
		}
	}
}));

// Mock $app/environment
vi.mock('$app/environment', () => ({
	dev: true, // Enable dev mode for validation and warnings in tests
	browser: true,
	building: false,
	version: 'test'
}));
