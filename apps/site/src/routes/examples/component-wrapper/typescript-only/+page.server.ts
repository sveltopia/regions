import type { PageServerLoad } from "./$types";
import { buildBreadcrumbsFromParents } from "$lib/utils/breadcrumbs";

export const load: PageServerLoad = async ({ parent, url }) => {
  const parentData = await parent();
  const breadcrumbs = buildBreadcrumbsFromParents(parentData, {
    label: "TypeScript Only",
    href: url.pathname,
  });

  return {
    regions: {
      ...(parentData.regions || {}),
      breadcrumbs,
      pageHeader: {
        title: "Page Component + TypeScript Only",
        description:
          "Client-side wrapper component with compile-time type checking. Smallest bundle size, no runtime validation overhead.",
      },
      sidebar: {
        items: [
          "Client-side only pages where SEO isn't critical",
          "Smallest possible bundle size (0kb validator overhead)",
          "Fastest possible performance",
          "Perfect for trusted internal data sources",
        ],
      },
      footer: {
        prev: {
          label: "Component Wrapper Zod",
          href: "/examples/component-wrapper/zod",
        },
        next: {
          label: "Snippet Strategy",
          href: "/examples/snippet",
        },
      },
    },
  };
};
