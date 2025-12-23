// Type definitions for SvelteKit app augmentation
// This file allows users to add regions to their page.data

import type { Regions } from './types';

declare global {
	namespace App {
		interface PageData {
			/**
			 * Optional regions data that can be set via load functions
			 * for SSR-friendly data-based regions
			 */
			regions?: Regions;
		}
	}
}

export {};
