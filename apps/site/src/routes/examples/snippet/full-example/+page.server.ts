import type { PageServerLoad } from './$types';
import { buildBreadcrumbsFromParents } from '$lib/utils/breadcrumbs';

export const load: PageServerLoad = async ({ parent, url }) => {
  const parentData = await parent();
  const breadcrumbs = buildBreadcrumbsFromParents(parentData, {
    label: 'TypeScript Only',
    href: url.pathname
  });

  return {
    regions: {
      ...(parentData.regions || {}),
      breadcrumbs,
      pageHeader: {
        title: 'Snippet + TypeScript Only',
        description:
          'Svelte 5 snippets with full page state access and compile-time type safety. Maximum flexibility.'
      },
      sidebar: {
        items: [
          'Full access to page state, props, and context',
          'Reactive updates when state changes',
          'Inline definition - no separate files',
          'Can wrap full components',
          'TypeScript compile-time type checking'
        ]
      },
      footer: {
        prev: {
          label: 'Snippet Strategy',
          href: '/examples/snippet'
        },
        next: {
          label: 'Advanced Patterns',
          href: '/examples/advanced'
        }
      }
    }
  };
};
