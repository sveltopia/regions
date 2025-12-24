// Vitest setup file for Svelte 5 testing
import { beforeAll } from 'vitest';

beforeAll(() => {
	// Ensure we're in a browser-like environment
	if (typeof window === 'undefined') {
		throw new Error('Tests must run in a browser-like environment');
	}

	// Note: $app/environment is mocked via Vite alias in vitest.config.ts
});
