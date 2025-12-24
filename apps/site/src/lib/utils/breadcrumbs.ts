/**
 * Breadcrumb item representing a navigation step
 */
export interface Breadcrumb {
  label: string;
  href: string;
}

/**
 * Builds breadcrumbs array from parent layout data and current page
 *
 * Parent layouts build up the breadcrumbs array as they go, so this
 * function simply retrieves that array and appends the current page.
 *
 * @param parentData - Data returned from await parent() in load function
 * @param current - Current page's breadcrumb info
 * @returns Array of breadcrumbs from root to current page
 *
 * @example
 * ```typescript
 * // In +page.server.ts
 * export const load = async ({ parent, url }) => {
 *   const parentData = await parent();
 *   const breadcrumbs = buildBreadcrumbsFromParents(parentData, {
 *     label: 'Valibot',
 *     href: url.pathname
 *   });
 *   return { regions: { breadcrumbs } };
 * };
 * ```
 */
export function buildBreadcrumbsFromParents(
  parentData: Record<string, unknown>,
  current: Breadcrumb
): Breadcrumb[] {
  // Get breadcrumbs array from parent layouts (they build it up as they go)
  const parentBreadcrumbs = (parentData.breadcrumbs || []) as Breadcrumb[];

  // Add current page and return
  return [...parentBreadcrumbs, current];
}
