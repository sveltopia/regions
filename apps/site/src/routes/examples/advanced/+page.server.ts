import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	return {
		regions: {
			// 1. INHERIT: Spread parent regions first
			...(parentData.regions || {}),

			// Page header (from parent examples layout)
			pageHeader: {
				title: 'Advanced: Region Inheritance',
				description:
					"Learn how to use SvelteKit's load function hierarchy to inherit, override, and extend regions across nested layouts and pages."
			},

			// 2. OVERRIDE: Redefine layoutInfo with same name
			layoutInfo: {
				source: 'child page',
				message: 'This data was overridden by +page.server.ts'
			},

			// 3. ADD: Define new region that didn't exist in parent
			pageOnlyRegion: {
				title: 'New Region Added by Page',
				description: 'This region only exists because the page defined it'
			}
		}
	};
};
