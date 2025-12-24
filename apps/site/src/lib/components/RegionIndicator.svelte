<script lang="ts">
  /**
   * Visual wrapper for region components that shows:
   * - Colored dashed border
   * - Region label/name
   * - Content area
   *
   * Used to visually indicate regions in example pages.
   */

  // Define available colors as a const array (single source of truth)
  const AVAILABLE_COLORS = [
    "indigo",
    "purple",
    "blue",
    "green",
    "emerald",
    "orange",
    "pink",
    "amber",
    "neutral",
  ] as const;

  // Derive the Color type from the array (Type follows data!)
  type Color = (typeof AVAILABLE_COLORS)[number];

  interface Props {
    label: string;
    color?: Color;
    children: import("svelte").Snippet;
  }

  let { label, color = "purple", children }: Props = $props();

  /**
   * Color classes with full Tailwind class names (required for JIT compiler)
   * Note: Can't use template literals because Tailwind needs to see full class names
   * at build time to generate the CSS.
   */
  const colorClasses = {
    indigo: {
      border: "border-indigo-500/50",
      bg: "bg-indigo-500/5",
      dot: "bg-indigo-500",
      text: "text-indigo-700 dark:text-indigo-400",
    },
    purple: {
      border: "border-purple-500/50",
      bg: "bg-purple-500/5",
      dot: "bg-purple-500",
      text: "text-purple-700 dark:text-purple-400",
    },
    blue: {
      border: "border-blue-500/50",
      bg: "bg-blue-500/5",
      dot: "bg-blue-500",
      text: "text-blue-700 dark:text-blue-400",
    },
    green: {
      border: "border-green-500/50",
      bg: "bg-green-500/5",
      dot: "bg-green-500",
      text: "text-green-700 dark:text-green-400",
    },
    emerald: {
      border: "border-emerald-500/50",
      bg: "bg-emerald-500/5",
      dot: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
    },
    orange: {
      border: "border-orange-500/50",
      bg: "bg-orange-500/5",
      dot: "bg-orange-500",
      text: "text-orange-700 dark:text-orange-400",
    },
    pink: {
      border: "border-pink-500/50",
      bg: "bg-pink-500/5",
      dot: "bg-pink-500",
      text: "text-pink-700 dark:text-pink-400",
    },
    amber: {
      border: "border-amber-500/50",
      bg: "bg-amber-500/5",
      dot: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-400",
    },
    neutral: {
      border: "border-border",
      bg: "bg-muted/30",
      dot: "bg-muted-foreground",
      text: "text-muted-foreground",
    },
  } satisfies Record<Color, { border: string; bg: string; dot: string; text: string }>;

  const colors = colorClasses[color];
</script>

<div
  class={`rounded-lg border-2 border-dashed ${colors.border} ${colors.bg} p-6`}>
  <div class="mb-4 flex items-center gap-2">
    <div class={`h-2 w-2 rounded-full ${colors.dot}`}></div>
    <span class={`text-xs font-medium ${colors.text}`}>
      {label}
    </span>
  </div>
  <div class="prose prose-slate dark:prose-invert max-w-none">
    {@render children()}
  </div>
</div>
