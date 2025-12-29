import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte({ hot: false })],
	resolve: {
		alias: {
			$app: path.resolve('./src/__tests__/__mocks__/$app')
		},
		conditions: ['browser']
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/__tests__/setup.ts'],
		include: ['cli/__tests__/**/*.test.ts', 'src/__tests__/**/*.test.ts'],
		exclude: ['**/node_modules/**', '**/test-output/**'],
		testTimeout: 30000, // E2E tests might take longer
		coverage: {
			provider: 'v8',
			exclude: [
				// Config files
				'**/*.config.*',
				'**/vitest-setup.ts',
				// TypeScript declaration files
				'**/*.d.ts',
				// CLI entry point and commands (covered by E2E tests)
				'cli/index.ts',
				'cli/commands/**',
				'cli/utils/prompts.ts',
				'cli/utils/files.ts',
				// Test files
				'**/__tests__/**',
				'**/__mocks__/**',
				// Build output
				'**/dist/**',
				'**/styled-system/**',
				// Default excludes
				'**/node_modules/**',
				'**/test-output/**'
			]
		}
	}
});
