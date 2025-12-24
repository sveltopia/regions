import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('svelte').Config} */
const config = {
	preprocess: vitePreprocess(),
	
	compilerOptions: {
		runes: true
	},

	// Tell the language server to use the local Svelte version
	onwarn: (warning, handler) => {
		// Suppress specific warnings if needed
		if (warning.code === 'a11y-click-events-have-key-events') return;
		handler(warning);
	}
};

export default config;
