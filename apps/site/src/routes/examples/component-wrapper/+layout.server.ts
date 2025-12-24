import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const parentData = await parent();
  const parentBreadcrumbs = (parentData.breadcrumbs || []) as Array<{
    label: string;
    href: string;
  }>;
  const parentRegions = (parentData as Record<string, unknown>).regions || {};

  return {
    breadcrumbs: [
      ...parentBreadcrumbs,
      {
        label: 'Component Wrapper',
        href: '/examples/component-wrapper'
      }
    ],
    regions: parentRegions
  };
};
