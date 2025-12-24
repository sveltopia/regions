import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const parentData = await parent();
	const parentBreadcrumbs = (parentData.breadcrumbs || []) as Array<{ label: string; href: string }>;
	const parentRegions = (parentData as Record<string, unknown>).regions || {};

	return {
		breadcrumbs: [
			...parentBreadcrumbs,
			{
				label: 'Advanced',
				href: '/examples/advanced'
			}
		],
		regions: {
			...parentRegions,
			// Parent layout defines these regions
			sharedNav: {
				title: 'Section Navigation',
				items: ['Overview', 'Getting Started', 'Advanced Topics']
			},
			layoutInfo: {
				source: 'parent layout',
				message: 'This data comes from +layout.server.ts'
			}
		}
	};
};
