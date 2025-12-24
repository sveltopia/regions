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
        title: "Page Component + Valibot Validation",
        description:
          "Client-side wrapper component with Valibot runtime validation. Smallest validator library (~1kb).",
      },
      sidebar: {
        items: [
          "Client-side only pages where SEO isn't critical",
          "Rapid prototyping - fastest way to get started",
          "When you want a validator with a tiny footprint (~1kb)",
          "When component props feel more natural than load functions",
        ],
      },
      footer: {
        prev: {
          label: "Component Wrapper Strategy",
          href: "/examples/component-wrapper",
        },
        next: {
          label: "Component Wrapper Zod",
          href: "/examples/component-wrapper/zod",
        },
      },
    },
  };
};
