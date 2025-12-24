<script lang="ts">
  import CodeViewer from "$lib/components/CodeViewer.svelte";

  // Code examples stored as variables to avoid TS parsing issues
  const typeCode = `/**
 * TypeScript-only type definition (no runtime validation).
 * For runtime validation, regenerate this region with Valibot or Zod.
 */
export interface ArticleHeaderData {
  title: string;
  description: string;
}`;

  const loadFunctionCode = `import type { PageServerLoad } from './$types';
import type { ArticleHeaderData } from '$lib/regions/article-header/ArticleHeaderData';

export const load: PageServerLoad = async () => {
  const data: ArticleHeaderData = {
    title: 'Understanding TypeScript-Only Validation',
    description: 'Learn when compile-time type checking is sufficient and how it eliminates runtime overhead.'
  };

  return {
    regions: {
      articleHeader: data
    }
  };
};`;

  const regionConsumerCode = `${"<"}script lang=\"ts\">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { ArticleHeaderData } from './ArticleHeaderData';
${"<"}/script>

<LayoutRegion name=\"articleHeader\">
  {#snippet children(data: Record<string, unknown>)}
    {@const typedData = data as unknown as ArticleHeaderData}
    <article class=\"article-header\">
      <h1>{typedData.title}</h1>
      <p class=\"lead\">{typedData.description}</p>
    </article>
  {/snippet}
</LayoutRegion>`;

  const componentAbstractedCode = `${"<"}script lang=\"ts\">
  import { LayoutRegion } from '@sveltopia/regions';
  import type { ArticleHeaderData } from './ArticleHeaderData';
${"<"}/script>

<LayoutRegion name=\"articleHeader\">
  {#snippet children(data: Record<string, unknown>)}
    {@const typedData = data as unknown as ArticleHeaderData}
    <article class=\"article-header\">
      <h1>{typedData.title}</h1>
      <p class=\"lead\">{typedData.description}</p>
    </article>
  {/snippet}
</LayoutRegion>`;

  const cleanLayoutCode = `${"<"}script lang=\"ts\">
  import ArticleHeaderRegion from '$lib/regions/article-header/ArticleHeaderRegion.svelte';

  let { children } = $props();
${"<"}/script>

<ArticleHeaderRegion />

<main class=\"content\">
  {@render children()}
</main>`;
</script>

<h2>Load Function + TypeScript Only</h2>

<div class="not-prose mb-8 rounded-lg border bg-indigo-500/5 p-6">
  <h3 class="text-lg font-semibold mb-3">Quick Start with CLI</h3>
  <p class="text-sm text-muted-foreground mb-4">
    Generate this entire pattern automatically:
  </p>
  <CodeViewer
    filename="terminal"
    language="bash"
    code="npx @sveltopia/regions add article-header" />
  <p class="text-sm text-muted-foreground mt-4">
    During the interactive prompts, select <strong>Load function</strong> strategy
    and <strong>TypeScript only</strong> validator, then define your fields (title,
    description).
  </p>
</div>

<h3>How It Works</h3>
<ul>
  <li>
    <strong>Most Svelte-native approach</strong> - Uses standard SvelteKit
    <code class="not-prose">load()</code> functions to pass data from page to layout
  </li>
  <li>
    <strong>Server-side rendered</strong> - Data is available immediately on page
    load, no client-side fetching
  </li>
  <li>
    <strong>TypeScript only</strong> - Compile-time type checking with no runtime
    validation overhead (0kb validator bundle)
  </li>
  <li>
    <strong>SEO-friendly</strong> - Content is in the initial HTML response for search
    engines
  </li>
  <li>
    <strong>Zero layout shift</strong> - No hydration flicker or content jumping
  </li>
  <li>
    <strong>Type-safe</strong> - Full TypeScript support with interface definitions
  </li>
</ul>

<h3>Code Examples (used on this page)</h3>

<div class="space-y-8">
  <div class="space-y-6">
    <p class="text-sm font-medium">
      1. Define your type with a TypeScript interface:
    </p>
    <CodeViewer
      filename="src/lib/regions/article-header/ArticleHeaderData.ts"
      language="typescript"
      code={typeCode} />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      2. Return region data from your load function:
    </p>
    <CodeViewer
      filename="src/routes/examples/load-function/typescript-only/+page.server.ts"
      language="typescript"
      code={loadFunctionCode} />
  </div>

  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium">
        3. Consume the region in your +layout.svelte file (no schema prop needed for TypeScript-only):
      </p>
      <p class="text-sm text-muted-foreground">
        <strong>Note:</strong> The
        <code class="not-prose">@const typedData = data as unknown as ArticleHeaderData</code>
        line narrows the type from
        <code class="not-prose">Record&lt;string, unknown&gt;</code>
        to your interface type for full TypeScript autocomplete and type safety.
        <a
          href="https://svelte.dev/docs/svelte/snippet#Typing-snippets"
          target="_blank"
          class="underline">Learn more about typing snippets</a
        >.
      </p>
    </div>
    <CodeViewer
      filename="src/routes/examples/load-function/typescript-only/+layout.svelte"
      language="svelte"
      code={regionConsumerCode} />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      4. Or, abstract the region to its own component for better organization
      (this is how our CLI generates regions):
    </p>
    <CodeViewer
      filename="src/lib/regions/article-header/ArticleHeaderRegion.svelte"
      language="svelte"
      code={componentAbstractedCode} />
  </div>

  <div class="space-y-6">
    <p class="text-sm font-medium">
      5. Then your +layout.svelte stays clean and organized &mdash; the region
      is now a self-contained component with its own schema, validation, and UI.
    </p>
    <CodeViewer
      filename="src/routes/examples/load-function/typescript-only/+layout.svelte"
      language="svelte"
      code={cleanLayoutCode} />
  </div>
</div>
