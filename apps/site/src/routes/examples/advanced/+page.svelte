<script lang="ts">
  import CodeViewer from '$lib/components/CodeViewer.svelte';
  import KeyConcept from '$lib/components/KeyConcept.svelte';
  import SvelteHead from '$lib/components/SvelteHead.svelte';
  import { CheckCircle2, XCircle } from 'lucide-svelte';

  const layoutServerCode = `import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const parentData = await parent();

  return {
    regions: {
      // Parent layout defines these regions
      sharedNav: {
        title: 'Section Navigation',
        items: ['Overview', 'Getting Started', 'Advanced Topics']
      },
      layoutInfo: {
        source: 'parent layout',
        message: 'This data comes from +layout.server.ts'
      }
    }
  };
};`;

  const pageServerCode = `import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();

  return {
    regions: {
      // 1. INHERIT: Spread parent regions first
      ...(parentData.regions || {}),

      // 2. OVERRIDE: Redefine layoutInfo with same name
      layoutInfo: {
        source: 'child page',
        message: 'This data was overridden by +page.server.ts'
      },

      // 3. ADD: Define new region that didn't exist in parent
      pageOnlyRegion: {
        title: 'New Region Added by Page',
        description: 'This region only exists because the page defined it'
      }
    }
  };
};`;

  const layoutSvelteCode = `${'<'}script>
  import { LayoutRegion } from "@sveltopia/regions";
  let { children } = $props();
${' <'}/script>

<!-- Regions defined in layout, populated by page data -->
<LayoutRegion name="sharedNav">
  {#snippet children(data)}
    <h3>{data.title}</h3>
    <ul>
      {#each data.items as item}
        <li>{item}</li>
      {/each}
    </ul>
  {/snippet}
</LayoutRegion>

<LayoutRegion name="layoutInfo">
  {#snippet children(data)}
    <p>Source: {data.source}</p>
    <p>{data.message}</p>
  {/snippet}
</LayoutRegion>

<LayoutRegion name="pageOnlyRegion">
  {#snippet children(data)}
    <p>{data.title}</p>
    <p>{data.description}</p>
  {/snippet}
</LayoutRegion>

<!-- Page content -->
{@render children()}`;
</script>

<SvelteHead
  title="Advanced Examples - @sveltopia/regions"
  description="Advanced patterns including region inheritance, layout-level regions, and region overrides in nested routes."
/>

<div class="prose max-w-none dark:prose-invert">
  <KeyConcept>
    <strong>Live Demo:</strong> The three regions at the top of this page demonstrate inheritance (blue),
    override (purple), and addition (green) patterns working together.
  </KeyConcept>

  <h2>How It Works</h2>

  <p>
    SvelteKit's <code>parent()</code> function allows child load functions to access data from parent
    layouts. We use this to create a flexible inheritance system for regions:
  </p>

  <ol>
    <li><strong>Inherit:</strong> Child pages automatically receive all parent regions</li>
    <li><strong>Override:</strong> Child can redefine a region with the same name</li>
    <li><strong>Add:</strong> Child can define new regions alongside inherited ones</li>
  </ol>

  <h2>The Pattern</h2>

  <div class="space-y-8">
    <div>
      <h3 class="mb-3 text-lg font-semibold">1. Parent Layout Defines Regions</h3>
      <p class="mb-4 text-sm text-muted-foreground">
        The parent layout's load function defines initial region data that will be available to all
        child pages.
      </p>
      <CodeViewer
        filename="routes/examples/advanced/+layout.server.ts"
        language="typescript"
        code={layoutServerCode}
      />
    </div>

    <div>
      <h3 class="mb-3 text-lg font-semibold">2. Child Page Inherits and Modifies</h3>
      <p class="mb-4 text-sm text-muted-foreground">
        The page calls <code>await parent()</code> to get parent data, then uses the spread operator to
        inherit regions before defining its own.
      </p>
      <CodeViewer
        filename="routes/examples/advanced/+page.server.ts"
        language="typescript"
        code={pageServerCode}
      />
    </div>

    <div>
      <h3 class="mb-3 text-lg font-semibold">3. Layout Defines Region Slots</h3>
      <p class="mb-4 text-sm text-muted-foreground">
        The layout defines where regions appear. The same <code>&lt;LayoutRegion&gt;</code>
        components receive different data depending on which page is active.
      </p>
      <CodeViewer
        filename="routes/examples/advanced/+layout.svelte"
        language="svelte"
        code={layoutSvelteCode}
      />
    </div>
  </div>

  <h2>Key Concepts</h2>

  <div class="not-prose space-y-4">
    <div class="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
      <p class="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-400">Inheritance (Blue)</p>
      <p class="text-sm">
        The <strong>sharedNav</strong> region is defined in the parent layout and inherited by the page
        without modification. It appears on all pages in this section.
      </p>
    </div>

    <div class="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
      <p class="mb-2 text-sm font-semibold text-purple-700 dark:text-purple-400">
        Override (Purple)
      </p>
      <p class="text-sm">
        The <strong>layoutInfo</strong> region is defined in the parent layout but overridden by the page.
        The page spreads parent regions first, then redefines this region with new data.
      </p>
    </div>

    <div class="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
      <p class="mb-2 text-sm font-semibold text-green-700 dark:text-green-400">Addition (Green)</p>
      <p class="text-sm">
        The <strong>pageOnlyRegion</strong> doesn't exist in the parent layout. It's defined only by this
        page, demonstrating how pages can add new regions alongside inherited ones.
      </p>
    </div>
  </div>

  <h2>Order Matters</h2>

  <KeyConcept>
    <strong>Always spread parent regions first!</strong> Spreading after your definitions will erase your
    changes.
  </KeyConcept>

  <div class="mb-6 grid gap-4 md:grid-cols-2">
    <div class="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
      <p
        class="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400"
      >
        <CheckCircle2 class="h-4 w-4" />
        Correct
      </p>
      <pre class="overflow-x-auto text-xs"><code
          >{`regions: {
  ...(parentData.regions || {}),
  layoutInfo: { /* override */ }
}`}</code
        ></pre>
    </div>

    <div class="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
      <p class="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
        <XCircle class="h-4 w-4" />
        Wrong
      </p>
      <pre class="overflow-x-auto text-xs"><code
          >{`regions: {
  layoutInfo: { /* override */ },
  ...(parentData.regions || {})
  // This erases your override!
}`}</code
        ></pre>
    </div>
  </div>

  <h2>When to Use This Pattern</h2>

  <ul>
    <li>
      <strong>Multi-level layouts:</strong> When you have nested route structures like
      <code>/products/[category]/[id]</code>
    </li>
    <li>
      <strong>Section-wide data:</strong> When all pages in a section share common regions (navigation,
      breadcrumbs, etc.)
    </li>
    <li>
      <strong>Progressive enhancement:</strong> When child pages need to extend or modify parent data
      while preserving some of it
    </li>
    <li>
      <strong>Flexible overrides:</strong> When some pages need to completely replace parent regions while
      others keep them
    </li>
  </ul>

  <h2>Learn More</h2>

  <div class="not-prose">
    <a
      href="/docs/advanced"
      class="inline-flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400"
    >
      Read the full Advanced documentation →
    </a>
  </div>
</div>
