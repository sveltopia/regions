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
        title: "Load Function + TypeScript Only",
        description:
          "Server-side rendering with compile-time type checking. Smallest bundle size, no runtime validation overhead.",
      },
      articleHeader: {
        title: "Understanding TypeScript-Only Validation",
        description:
          "Learn when compile-time type checking is sufficient and how it eliminates runtime overhead.",
      },
      sidebar: {
        items: [
          "SEO-critical content (page titles, meta descriptions, headings)",
          "Smallest possible bundle size (0kb validator overhead)",
          "Fastest possible performance",
          "Perfect for trusted internal data sources",
        ],
      },
      footer: {
        prev: {
          label: "Zod Validation",
          href: "/examples/load-function/zod",
        },
        next: {
          label: "Component Wrapper Strategy",
          href: "/examples/component-wrapper",
        },
      },
    },
  };
};
