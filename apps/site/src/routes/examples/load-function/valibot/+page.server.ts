import type { PageServerLoad } from "./$types";
import { buildBreadcrumbsFromParents } from "$lib/utils/breadcrumbs";

export const load: PageServerLoad = async ({ parent, url }) => {
  const parentData = await parent();
  const breadcrumbs = buildBreadcrumbsFromParents(parentData, {
    label: "Valibot",
    href: url.pathname,
  });

  return {
    regions: {
      ...(parentData.regions || {}),
      breadcrumbs,
      pageHeader: {
        title: "Load Function + Valibot Validation",
        description:
          "Server-side rendering with Valibot runtime validation. Smallest validator library (~1kb).",
      },
      dashboardHeader: {
        title: "System Dashboard",
        userCount: 1247,
        isLive: true,
      },
      sidebar: {
        items: [
          "SEO-critical content (page titles, meta descriptions, headings)",
          "Content needed on first paint with no loading states",
          "When you want a validator with a tiny footprint (~1kb)",
          "Server-side data fetching or database queries",
        ],
      },
      footer: {
        prev: {
          label: "Load Function Strategy",
          href: "/examples/load-function",
        },
        next: {
          label: "Zod Validation",
          href: "/examples/load-function/zod",
        },
      },
    },
  };
};
