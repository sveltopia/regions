import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const parentData = await parent();
	const parentBreadcrumbs = (parentData.breadcrumbs || []) as Array<{ label: string; href: string }>;
	const parentRegions = (parentData as any).regions || {};

	return {
		breadcrumbs: [
			...parentBreadcrumbs,
			{
				label: 'Snippet',
				href: '/examples/snippet'
			}
		],
		regions: parentRegions
	};
};
