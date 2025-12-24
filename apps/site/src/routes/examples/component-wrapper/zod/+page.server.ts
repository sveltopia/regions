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
        title: "Page Component + Zod Validation",
        description:
          "Client-side wrapper component with Zod runtime validation. Most popular TypeScript schema validator (~14kb).",
      },
      sidebar: {
        items: [
          "Client-side only pages where SEO isn't critical",
          "Most popular validator with rich ecosystem",
          "Feature-rich with extensive built-in validators",
          "Great for complex validation scenarios",
        ],
      },
      footer: {
        prev: {
          label: "Component Wrapper Valibot",
          href: "/examples/component-wrapper/valibot",
        },
        next: {
          label: "Component Wrapper TypeScript Only",
          href: "/examples/component-wrapper/typescript-only",
        },
      },
    },
  };
};
