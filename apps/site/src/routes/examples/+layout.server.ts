import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
  return {
    breadcrumbs: [
      {
        label: 'Examples',
        href: '/examples'
      }
    ]
  };
};
