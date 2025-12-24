import type { PageServerLoad } from "./$types";
import { buildBreadcrumbsFromParents } from "$lib/utils/breadcrumbs";

export const load: PageServerLoad = async ({ parent, url }) => {
  const parentData = await parent();
  const breadcrumbs = buildBreadcrumbsFromParents(parentData, {
    label: "Zod",
    href: url.pathname,
  });

  return {
    regions: {
      ...(parentData.regions || {}),
      breadcrumbs,
      pageHeader: {
        title: "Load Function + Zod Validation",
        description:
          "Server-side rendering with Zod runtime validation. Most popular TypeScript schema validator (~14kb).",
      },
      productHeader: {
        productName: "Premium Wireless Headphones",
        price: 299.99,
        inStock: true,
      },
      sidebar: {
        items: [
          "SEO-critical content (page titles, meta descriptions, headings)",
          "Most popular validator with rich ecosystem",
          "Feature-rich with extensive built-in validators",
          "Excellent TypeScript support and error messages",
        ],
      },
      footer: {
        prev: {
          label: "Valibot Validation",
          href: "/examples/load-function/valibot",
        },
        next: {
          label: "TypeScript Only Validation",
          href: "/examples/load-function/typescript-only",
        },
      },
    },
  };
};
