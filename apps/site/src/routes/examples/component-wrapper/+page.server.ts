import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();

  return {
    regions: {
      breadcrumbs: parentData.breadcrumbs,
      pageHeader: {
        title: 'Component Wrapper Strategy',
        description:
          'Client-side wrapper components with simple prop-based API. Fast and intuitive.'
      },
      sidebar: {
        items: [
          "Client-side only pages where SEO isn't critical",
          'Rapid prototyping - fastest way to get started',
          'Simple component-based API - just use props',
          'No load function needed',
          'Choose your validator: Valibot, Zod, or TypeScript only'
        ]
      },
      footer: {
        prev: {
          label: 'TypeScript Only Validation',
          href: '/examples/load-function/typescript-only'
        },
        next: {
          label: 'Component Wrapper Valibot',
          href: '/examples/component-wrapper/valibot'
        }
      }
    }
  };
};
