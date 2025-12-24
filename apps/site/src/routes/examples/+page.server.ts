import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	return {
		regions: {
			breadcrumbs: parentData.breadcrumbs,
			pageHeader: {
				title: 'Region Strategy Examples',
				description: 'Explore different ways to use @sveltopia/regions. Each example demonstrates a different strategy for passing content from pages to parent layouts.'
			}
		}
	};
};
