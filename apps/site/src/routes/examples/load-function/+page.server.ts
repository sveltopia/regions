import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();

  return {
    regions: {
      breadcrumbs: parentData.breadcrumbs,
      pageHeader: {
        title: 'Load Function Strategy',
        description:
          'Server-side rendering with SvelteKit load functions. Zero layout shift, perfect for SEO.'
      },
      sidebar: {
        items: [
          'SEO-critical content (page titles, meta descriptions)',
          'Content needed on first paint with zero layout shift',
          'Server-side data fetching or database queries',
          'When you want validation with runtime safety',
          'Most Svelte-native approach using standard load() functions'
        ]
      },
      footer: {
        next: {
          label: 'Valibot Validation',
          href: '/examples/load-function/valibot'
        }
      }
    }
  };
};
