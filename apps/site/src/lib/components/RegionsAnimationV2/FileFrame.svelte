<script lang="ts">
  import type { Snippet } from "svelte";

  export interface FileTab {
    filename: string;
    active: boolean;
  }

  interface Props {
    /** Array of tabs to display */
    tabs: FileTab[];
    /** Color of the active tab's top border (tailwind class without 'border-t-') */
    accentColor?: "orange-600" | "indigo-600";
    /** Optional children content for the frame body */
    children?: Snippet;
    /** Additional CSS classes */
    class?: string;
  }

  let {
    tabs,
    accentColor = "orange-600",
    children,
    class: className = "",
  }: Props = $props();
</script>

<!--
  FileFrame: Reusable VS Code-style file tab frame
  - Configurable tabs with active state
  - Configurable accent color for active tab
  - 400x327px total (28px tabs + 300px body)
-->
<div class="file-frame {className}">
  <!-- Tab Bar -->
  <div class="tab-bar">
    {#each tabs as tab (tab.filename)}
      <div
        class="tab"
        class:active={tab.active}
        class:accent-orange={tab.active && accentColor === "orange-600"}
        class:accent-indigo={tab.active && accentColor === "indigo-600"}
      >
        <span class="tab-text">{tab.filename}</span>
      </div>
    {/each}
  </div>

  <!-- Frame Body -->
  <div class="frame-body">
    {@render children?.()}
  </div>
</div>

<style>
  @reference "../../../app.css";

  .file-frame {
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))
      drop-shadow(0 13px 27px rgba(50, 50, 93, 0.25));
  }

  .tab-bar {
    display: flex;
    flex-direction: row;
  }

  .tab {
    position: relative;
    padding: 0 16px;
    height: 28px;
    display: flex;
    align-items: center;
    @apply bg-slate-200 border border-indigo-200 dark:bg-slate-800 dark:border-indigo-400;
    border-bottom: none;
  }

  /* First tab - rounded top-left */
  .tab:first-child {
    @apply rounded-tl-md;
  }

  /* Last tab - rounded top-right */
  .tab:last-child {
    @apply rounded-tr-md;
  }

  /* Only child - both corners rounded */
  .tab:only-child {
    @apply rounded-t-md;
  }

  /* Remove left border on non-first tabs to avoid double borders */
  .tab:not(:first-child) {
    border-left: none;
  }

  /* Active tab base styles */
  .tab.active {
    @apply bg-slate-50 dark:bg-slate-900 border-l border-l-indigo-400 border-r-indigo-300;
    border-top-width: 3px;
  }

  /* Active tab accent colors */
  .tab.accent-orange {
    @apply border-t-orange-600;
  }

  .tab.accent-indigo {
    @apply border-t-indigo-600;
  }

  /* Cover the frame body border to create seamless connection */
  .tab.active:before {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 4px;
    @apply bg-slate-50;
  }

  :global(.dark) .tab.active:before {
    @apply bg-slate-900;
  }

  .tab-text {
    @apply text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap;
  }

  .frame-body {
    width: 400px;
    height: 300px;
    @apply bg-slate-50 border border-indigo-400 dark:bg-slate-900 dark:border-indigo-400;
    @apply rounded-b-md rounded-tr-md;
  }

  /* When first tab is active, frame body needs different rounding */
  .tab-bar:has(.tab:first-child.active) + .frame-body {
    @apply rounded-tr-md;
  }
</style>
