import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();

  return {
    meta: {
      title: 'Examples - @sveltopia/regions',
      description:
        'Working examples of @sveltopia/regions showing all three strategies: load functions, component wrappers, and snippets. See each approach with Valibot, Zod, or TypeScript-only validation.'
    },
    regions: {
      breadcrumbs: parentData.breadcrumbs,
      pageHeader: {
        title: 'Region Strategy Examples',
        description:
          'Explore different ways to use @sveltopia/regions. Each example demonstrates a different strategy for passing content from pages to parent layouts.'
      }
    }
  };
};
