import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();

  return {
    regions: {
      ...(parentData.regions || {}),
      breadcrumbs: parentData.breadcrumbs,
      pageHeader: {
        title: 'Snippet Strategy',
        description:
          'Svelte 5 snippets with full page state access. Maximum flexibility and reactivity.'
      },
      sidebar: {
        items: [
          'Full access to page state, props, and context',
          'Reactive updates when state changes',
          'Inline definition - no separate files',
          'TypeScript compile-time type checking'
        ]
      },
      footer: {
        prev: {
          label: 'Component Wrapper TypeScript Only',
          href: '/examples/component-wrapper/typescript-only'
        },
        next: {
          label: 'Snippet Full Example',
          href: '/examples/snippet/full-example'
        }
      }
    }
  };
};
